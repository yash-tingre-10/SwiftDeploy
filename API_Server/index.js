const express = require('express');
const { generateSlug } = require('random-word-slugs');
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');
const Redis = require('ioredis');
const { Server } = require('socket.io' );
require('dotenv').config(); // Load .env file

const app = express();
const PORT = 9000;

const ecsClient = new ECSClient( { 
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
        secretAccessKey: process.env.AWS_ADMIN_SECRET_KEY
    }
});

const config = {
    CLUSTER: process.env.ECS_CLUSTER,
    TASK_DEFINITION: process.env.ECS_TASK_DEF
}

const subscriber = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: {}
  });

subscriber.once('connect', () => {
    console.log("Connected to Redis Subscriber");
});

app.use( express.json());
const io = new Server( {cors: '*'});

io.on( 'connection', socket =>{
    socket.on( 'subscriber', channel => {
        socket.join( channel );
        socket.emit( 'message', `Joined ${channel }` )
    } )
} )

io.listen( 9002, () => console.log( 'Listening on Port 9002') );

app.post('/project', async(req, res ) => {
    const { gitURL } = req.body;
    const projectSlug =  generateSlug();

    const command = new RunTaskCommand( {
        region: process.env.AWS_REGION,
        cluster: config.CLUSTER,
        taskDefinition: config.TASK_DEFINITION,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: [ process.env.AWS_SUBNET_1, process.env.AWS_SUBNET_2, process.env.AWS_SUBNET_3 ],
                securityGroups: [process.env.AWS_SECURITY_GROUP],
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'swift-deploy-image',
                    environment: [
                        {
                            name: 'GIT_REPOSITORY_URL',
                            value: gitURL
                        },
                        {
                            name: 'PROJECT_ID',
                            value: projectSlug
                        }
                    ]
                }
            ]
        }


    })

    await ecsClient.send(command);
    return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000`}});

} )

async function initRedisSubscribe( ) {
    console.log("Subscribing to logs");
    subscriber.psubscribe( 'logs:*');
    subscriber.on( 'pmessage', ( pattern, channel, message ) => {
        io.to( channel ).emit( 'message', message);
    })
}

initRedisSubscribe();

app.listen(PORT, () => {
    console.log(`API Server is running on port ${PORT}`);
})

