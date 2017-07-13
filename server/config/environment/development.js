'use strict';

// Development specific configuration
// ==================================
module.exports = {

  ip: '127.0.0.1',

  httpsPort: 4343,
  httpPort: 8085,

  url: 'https://localhost:4343',

  // CWL
  callbackUrl: 'https://localhost:4343/auth/cwl/login/callback',
  entryPoint: 'https://authentication.stg.id.ubc.ca/idp/profile/SAML2/Redirect/SSO',
  idpCert: path.join(__dirname, '/../../..', 'server/cert/idp_cert-staging.pem'),

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/its110-dev'
  },

  seedDB: true
};
