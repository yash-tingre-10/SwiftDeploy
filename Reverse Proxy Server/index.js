const express = require("express");
const httpProxy = require("http-proxy");
require("dotenv").config();

const app = express();
const proxy = httpProxy.createProxy();

const BASE_PATH = process.env.AWS_BUCKET_BASE_PATH;
const PORT = process.env.PORT || 3000; // Use PORT from env or default to 3000

app.use((req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];
  const resolvesTo = `${BASE_PATH}/${subdomain}`;

  return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
  const url = req.url;
  if (url === "/") proxyReq.path += "index.html";
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

