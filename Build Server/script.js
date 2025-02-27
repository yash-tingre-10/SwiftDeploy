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
console.log(`🚀 Starting deployment for project: ${PROJECT_ID}`);

function publisherLog(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify(log));
}

async function init() {
    console.log("⚙️  Initializing deployment process...");
    publisherLog('🚀 Deployment process started');

    const outputDirPath = path.join(__dirname, 'output');

    console.log("📦 Installing dependencies...");
    publisherLog('📦 Installing dependencies...');
    const p = exec(`cd ${outputDirPath} && npm install --silent && npm run build --silent`);

    p.stdout.on('data', function (data) {
        const message = data.toString().trim();
        if (!message.includes('added') && !message.includes('audited')) {
            console.log(`📜 ${message}`);
            publisherLog(message); // Only send meaningful logs
        }
    });

    p.stderr.on('data', function (data) {
        console.log('❌ Error:', data.toString().trim());
        // No error logs to Redis, only console
    });

    p.on('close', async function (code) {
        if (code !== 0) {
            console.log(`❌ Build failed with exit code ${code}`);
            publisherLog(`❌ Build failed with exit code ${code}`);
            process.exit(code);
            return;
        }

        console.log('✅ Build completed successfully!');
        publisherLog('✅ Build completed successfully');

        const distFolder = path.join(__dirname, 'output', 'dist');
        const buildFolder = path.join(__dirname, 'output', 'build');

        const outputFolderName = fs.existsSync(distFolder) ? 'dist' : fs.existsSync(buildFolder) ? 'build' : '';
        if (!outputFolderName) {
            console.log('⚠️ No valid build output folder found (dist/build missing).');
            publisherLog('⚠️ No valid build output folder found (dist/build missing).');
            process.exit(1);
        }

        console.log(`📂 Build files detected in "${outputFolderName}" folder.`);
        publisherLog(`📂 Build files detected in "${outputFolderName}" folder.`);

        const distFolderPath = path.join(__dirname, 'output', outputFolderName);
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

        console.log('📤 Preparing to upload files to S3...');

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log(`⬆️ Uploading file: ${file}`);

            const command = new PutObjectCommand({
                Bucket: 'swift-deploy-bucket',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath) || 'application/octet-stream'
            });

            await s3Client.send(command);
            console.log(`✅ Successfully uploaded: ${file}`);
        }

        console.log('🎉 Deployment process completed successfully!');
        publisherLog('🎉 Deployment process completed successfully!');

        // Small delay to ensure final log is published before exit
        setTimeout(() => process.exit(0), 500);
    });
}

init();
