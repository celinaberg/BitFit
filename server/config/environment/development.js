'use strict';

// Development specific configuration
// ==================================
module.exports = {

  ip: '127.0.0.1',

  port: 4343,

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/its110-dev'
  },

  seedDB: true
};
