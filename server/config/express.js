/**
 * Express configuration
 */

const express = require('express')
// var favicon = require('serve-favicon');
const morgan = require('morgan')
const compression = require('compression')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const errorHandler = require('errorhandler')
const path = require('path')
const config = require('./environment')
const passport = require('passport')
const ejs = require('ejs')
const connectLivereload = require('connect-livereload')

function init (app) {
  const env = app.get('env')

  app.disable('x-powered-by')
  app.set('views', path.join(config.root, '/server/views'))
  app.engine('html', ejs.renderFile)
  app.set('view engine', 'html')
  app.use(compression())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(methodOverride())
  app.use(cookieParser())
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(express.static(path.join(__dirname, '../../build/client')))
  if (env === 'production') {
    app.set('appPath', 'client')
    app.use(morgan('dev'))
  }

  if (env === 'development' || env === 'test') {
    app.use(connectLivereload())
    app.set('appPath', 'client')
    app.use(morgan('dev'))
    app.use(errorHandler()) // Error handler - has to be last
  }

  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Internal error. Please try again later.')
  })
}

module.exports = init
