/**
 * Express configuration
 */


const express = require('express');
// var favicon = require('serve-favicon');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');
const path = require('path');
const config = require('./environment');
const passport = require('passport');
const ejs = require('ejs');
const connectLivereload = require('connect-livereload');

function init(app) {
  const env = app.get('env');

  app.set('views', path.join(config.root, '/server/views'));
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  if (env === 'production') {
    // app.use(express.static(path.join(config.root, '.tmp')));
    // app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static('client'));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
  }

  if (env === 'development' || env === 'test') {
    app.use(connectLivereload());
    // app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static('client'));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
}

module.exports = init;
