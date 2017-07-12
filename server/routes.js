/**
 * Main application routes
 */

'use strict';

var Loggers = require('./api/logger');
var CLIs = require('./api/cli');
var Topic = require('./api/topic');
var Question = require('./api/question');
var User = require('./api/user');
var Auth = require('./auth');
var errors = require('./components/errors');

module.exports = function (app) {
  // Insert routes below
  app.use('/api/loggers', Loggers);
  app.use('/api/clis', CLIs);
  app.use('/api/topic', Topic);
  app.use('/api/questions', Question);
  app.use('/api/users', User);

  app.use('/auth', Auth);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function (req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
