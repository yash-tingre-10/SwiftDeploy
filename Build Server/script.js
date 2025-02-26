const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require('mime-types');
const Redis = require('ioredis');
require('dotenv').config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
        secretAccessKey: process.env.AWS_ADMIN_SECRET_KEY
    }
});

const publisher = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: {}
});

const PROJECT_ID = process.env.PROJECT_ID;
console.log(`Project Name ${PROJECT_ID}`);

function publisherLog(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify(log));
}

async function init() {
    console.log("executing script.js");

    const outputDirPath = path.join(__dirname, 'output');
    publisherLog('🚀 Starting build process...');
    publisherLog('Installing Dependencies...');
    const p = exec(`cd ${outputDirPath} && npm install && npm run build`);

    p.stdout.on('data', function (data) {
        console.log(data.toString());
        publisherLog(data.toString());
    });

    p.stderr.on('data', function (data) {
        console.log('Error', data.toString());
        publisherLog(`Error ${data.toString()}`);
    });

    p.on('close', async function (code) {
        if (code !== 0) {
            console.log(`Build process exited with code ${code}`);
            publisherLog(`Build process exited with code ${code}`);
            process.exit(code); // Exit with the same code if build fails
            return;
        }

        console.log('Build Complete');
        publisherLog('Build Complete');
        const distFolder = path.join(__dirname, 'output', 'dist');
        const buildFolder = path.join(__dirname, 'output', 'build');

        const outputFolderName = fs.existsSync(distFolder) ? 'dist' : fs.existsSync(buildFolder) ? 'build' : '';
        console.log(`Build Files in... ${outputFolderName}`);

        const distFolderPath = path.join(__dirname, 'output', outputFolderName);
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);

            if (fs.lstatSync(filePath).isDirectory()) continue;
            console.log('Uploading', filePath);
            publisherLog(`Uploading ${filePath}`);
            const command = new PutObjectCommand({
                Bucket: 'swift-deploy-bucket',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath),
            });

            await s3Client.send(command);
            console.log(`Uploaded ${filePath}`);
        }

        console.log('Done...');
        publisherLog('Done...');

        // Exit the process after everything is done
        process.exit(0);
    });
}

init();