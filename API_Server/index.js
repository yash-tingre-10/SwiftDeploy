const express = require('express');
const { createServer } = require('http');
const { generateSlug } = require('random-word-slugs');
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');
const Redis = require('ioredis');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = createServer(app);
const PORT = process.env.SERVER_PORT;

const ecsClient = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
        secretAccessKey: process.env.AWS_ADMIN_SECRET_KEY
    }
});

const config = {
    CLUSTER: process.env.ECS_CLUSTER,
    TASK_DEFINITION: process.env.ECS_TASK_DEF
};

// Enable CORS for API requests
app.use(cors());
app.use(express.json());

// Redis setup
const subscriber = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: {}
});

subscriber.once('connect', () => {
    console.log("✅ Connected to Redis Subscriber");
});

// In-memory log storage per projectSlug
const logs = {};

// Redis subscription for logs
async function initRedisSubscribe() {
    console.log("📡 Subscribing to logs...");
    subscriber.psubscribe('logs:*');
    subscriber.on('pmessage', (pattern, channel, message) => {
        console.log(`Received message on channel ${channel}:`, message);

        // Extract projectSlug from the channel name
        const projectSlug = channel.split(':')[1]; // Assumes channel format is "logs:projectSlug"
        if (!logs[projectSlug]) {
            logs[projectSlug] = []; // Initialize log array for this projectSlug
        }

        logs[projectSlug].push(message); // Store logs for this projectSlug
    });
}

initRedisSubscribe();

// API Route: Fetch logs for a specific projectSlug
app.get('/logs/:projectSlug', (req, res) => {
    const { projectSlug } = req.params;

    if (!logs[projectSlug]) {
        return res.status(404).json({ error: 'No logs found for this project' });
    }

    res.json(logs[projectSlug]); // Return logs for the specified projectSlug
});

// API Route: Deploy a new project
app.post('/project', async (req, res) => {
    const { gitURL } = req.body;
    const projectSlug = generateSlug();

    const command = new RunTaskCommand({
        region: process.env.AWS_REGION,
        cluster: config.CLUSTER,
        taskDefinition: config.TASK_DEFINITION,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: [process.env.AWS_SUBNET_1, process.env.AWS_SUBNET_2, process.env.AWS_SUBNET_3],
                securityGroups: [process.env.AWS_SECURITY_GROUP],
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'swift-deploy-image',
                    environment: [
                        { name: 'GIT_REPOSITORY_URL', value: gitURL },
                        { name: 'PROJECT_ID', value: projectSlug }
                    ]
                }
            ]
        }
    });

    try {
        await ecsClient.send(command);
        return res.json({ 
            status: 'queued', 
            data: { 
                projectSlug, 
                url: `https://swiftdeploy.onrender.com/index.html?deploy=${projectSlug}`
            }
        });
    } catch (err) {
        console.error("❌ ECS Task Deployment Error:", err);
        return res.status(500).json({ error: 'Failed to deploy project' });
    }
});

// Start server on the assigned Render PORT
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});