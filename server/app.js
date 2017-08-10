/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/environment");
const https = require("https");
const http = require("http");
const fs = require("fs");
const routes = require("./routes");
const configExpress = require("./config/express");
const path = require("path");

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if (config.seedDB) {
  require("./config/seed");
}

// new for HTTPS
const options = {
  cert: fs.readFileSync(path.join(__dirname, "./cert/certificate.crt"), "utf8"),
  key: fs.readFileSync(path.join(__dirname, "./cert/server.key"), "utf8")
};

// Setup server
const app = express();

// new for HTTPS
const server = https.createServer(options, app);
configExpress(app);
routes(app);

// Start server
server.listen(config.httpsPort, config.ip, () => {
  console.log(
    "Express server listening on %d, in %s mode",
    config.httpsPort,
    config.env
  );
});

// redirect to HTTPS
http
  .createServer((req, res) => {
    res.writeHead(301, { Location: config.url });
    res.end();
  })
  .listen(config.httpPort);

// Expose app
module.exports = app;
