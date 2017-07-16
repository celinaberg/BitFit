/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/environment')
const https = require('https')
const http = require('http')
const fs = require('fs')
const routes = require('./routes')
const configExpress = require('./config/express')
const configSocketIo = require('./config/socketio')
const SocketIo = require('socket.io')
const certificate = require('./cert/certificate.crt')
const serverKey = require('./cert/server.key')

// Connect to database
mongoose.Promise = global.Promise
mongoose.connect(config.mongo.uri, config.mongo.options)

// Populate DB with sample data
if (config.seedDB) { require('./config/seed') }

// new for HTTPS
const options = {
  cert: fs.readFileSync(certificate, 'utf8'),
  key: fs.readFileSync(serverKey, 'utf8')
}

// Setup server
const app = express()

// new for HTTPS
const server = https.createServer(options, app)
const socketio = SocketIo(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
})
configSocketIo(socketio)
configExpress(app)
routes(app)

// Start server
server.listen(config.httpsPort, config.ip, () => {
  console.log('Express server listening on %d, in %s mode', config.httpsPort, config.env)
})

// redirect to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { Location: config.url })
  res.end()
}).listen(config.httpPort)

// Expose app
module.exports = app
