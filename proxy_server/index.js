const express = require("express");
const axios = require("axios");

const PORT = 3000;
const app = express();

// Stream files from S3
app.get("*", async (req, res) => {
  const deploy = req.query.deploy;
  const filePath = req.path.replace(/^\/+/, "");
  const BASE_URL = `https://swift-deploy-bucket.s3.ap-south-1.amazonaws.com/__outputs/${deploy}`;
  const url = `${BASE_URL}/${filePath}`;

  try {
    const response = await axios({ url, responseType: "stream" });
    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    res.status(404).send("❌ File not found");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Streaming server running at http://localhost:${PORT}`);
});
