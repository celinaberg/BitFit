/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var path = require('path');
var https = require('https');
var http = require('http');
var fs = require('fs');
var routes = require('./routes');
var configExpress = require('./config/express');
var configSocketIo = require('./config/socketio');
var SocketIo = require('socket.io');

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if (config.seedDB) { require('./config/seed'); }

// new for HTTPS
var options = {
  cert: fs.readFileSync(path.join(__dirname, 'cert/certificate.crt')),
  key: fs.readFileSync(path.join(__dirname, 'cert/server.key'))
};

// Setup server
var app = express();

// new for HTTPS
var server = https.createServer(options, app);
// var server = require('http').createServer(app);
var socketio = SocketIo(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
configSocketIo(socketio);
configExpress(app);
routes(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// redirect to HTTPS
http.createServer(function (req, res) {
  res.writeHead(301, { Location: 'https://comped.cs.ubc.ca' });
  res.end();
}).listen(8085);

// Expose app
module.exports = app;
