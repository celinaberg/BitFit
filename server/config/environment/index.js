'use strict';

var path = require('path');
var _ = require('lodash');
var environment = require('./' + process.env.NODE_ENV + '.js');

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.join(__dirname, '/../../..'),

  // Server port
  port: process.env.PORT || 443,
  // ip: '192.168.2.1',
  // Should we populate the DB with sample data?
  seedDB: false, // fixme?

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'its110-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all, environment || {});
