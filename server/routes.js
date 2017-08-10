/**
 * Main application routes
 */

const Api = require('./api')
const Auth = require('./auth')
const errors = require('./components/errors')
const path = require('path')

function defaultRouteHandler (req, res) {
  res.render(path.join(__dirname, '../client/index.html'))
}

function init (app) {
  app.use('/api/v2.0', Api)

  app.use('/auth', Auth)

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404])

  // All other routes should redirect to the index.html
  app.route('/*').get(defaultRouteHandler)
}

module.exports = init
