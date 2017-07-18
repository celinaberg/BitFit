const path = require('path')
const _ = require('lodash')

const environment = require(`./${process.env.NODE_ENV}.js`)

// All configurations will extend these options
// ============================================
const all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.join(__dirname, '/../../..'),

  ip: '0.0.0.0',

  // Server port
  httpsPort: 443,
  httpPort: 80,

  url: 'https://comped.cs.ubc.ca',

  // ip: '192.168.2.1',
  // Should we populate the DB with sample data?
  seedDB: false, // fixme?

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'its110-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // CWL
  callbackUrl: 'https://comped.cs.ubc.ca/auth/cwl/login/callback',
  entryPoint: 'https://authentication.ubc.ca/idp/profile/SAML2/Redirect/SSO',
  idpCert: path.join(__dirname, '../../cert/idp_cert.pem'),

  // MongoDB connection options
  mongo: {
    options: {
      useMongoClient: true
    }
  }
}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all, environment || {})
