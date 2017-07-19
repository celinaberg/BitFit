/**
 * Main application routes
 */

const Loggers = require('./api/logger')
const CLIs = require('./api/cli')
const Topic = require('./api/topic')
const Question = require('./api/question')
const User = require('./api/user')
const Auth = require('./auth')
const errors = require('./components/errors')
const path = require('path')

function defaultRouteHandler (req, res) {
  res.render(path.join(__dirname, '../client/index.html'))
}

function init (app) {
  // Insert routes below
  app.use('/api/loggers', Loggers)
  app.use('/api/clis', CLIs)
  app.use('/api/topics', Topic)
  app.use('/api/questions', Question)
  app.use('/api/users', User)

  app.use('/auth', Auth)

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404])

  // All other routes should redirect to the index.html
  app.route('/*').get(defaultRouteHandler)
}

module.exports = init
