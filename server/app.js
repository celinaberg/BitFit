/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// new for HTTPS
var fs = require('fs');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// new for HTTPS
var options = {
      cert: fs.readFileSync(__dirname+'/certificate.crt'),
      key: fs.readFileSync(__dirname+'/server.key')
    };


// Setup server
var app = express();

// new for HTTPS
var server = require('https').createServer(options, app);
//var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server//server.listen(4343);
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// redirect to HTTPS
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://comped.cs.ubc.ca" });
    res.end();
}).listen(8085);


// Expose app
exports = module.exports = app;
