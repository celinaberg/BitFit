// @flow

/**
 * Main application file
 */

import type { $Application, $Request, $Response } from "express";

import express from "express";
import mongoose from "mongoose";
import config from "./config/environment";
import https from "https";
import http from "http";
import fs from "fs";
import routes from "./routes";
import configExpress from "./config/express";
import path from "path";
import { seedTestData } from "./config/seed";

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if (config.seedDB) {
  seedTestData();
}

// new for HTTPS
const options = {
  cert: fs.readFileSync(path.join(__dirname, "./cert/certificate.crt"), "utf8"),
  key: fs.readFileSync(path.join(__dirname, "./cert/server.key"), "utf8")
};

// Setup server
const app: $Application = express();

// new for HTTPS
const server = https.createServer(options, app);
configExpress(app, mongoose.connection);
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
  .createServer((req: $Request, res: $Response) => {
    res.writeHead(301, { Location: config.url });
    res.end();
  })
  .listen(config.httpPort);

// Expose app
export default app;
