/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/helpForums', require('./api/helpForum'));
  app.use('/api/loggers', require('./api/logger'));
  app.use('/api/clis', require('./api/cli'));
  app.use('/api/topics', require('./api/topic'));
  app.use('/api/questions', require('./api/question'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*').get(function(req, res) {
    res.sendFile(path.join(app.get('appPath'), 'index.html'));
  });
};
