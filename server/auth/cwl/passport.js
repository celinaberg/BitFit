var passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy;
var fs = require('fs');
var path = require('path');
var config = require('../../config/environment');
var User = require('../../api/user/user.model');
var key = require('../../cert/key.pem');
var cert = require('../../cert/idp_cert.pem');

passport.serializeUser(function (user, done) {
  console.log('Serialize User');
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

var samlStrategy = new SamlStrategy({
  // URL that goes from the Identity Provider -> Service Provider
  //callbackUrl: 'https://127.0.0.1:4343/auth/cwl/login/callback',
  callbackUrl: 'https://comped.cs.ubc.ca/auth/cwl/login/callback',
  // URL that goes from the Service Provider -> Identity Provider
  // entryPoint: 'https://authentication.ubc.ca',
  entryPoint: 'https://authentication.stg.id.ubc.ca/idp/profile/SAML2/Redirect/SSO',
  //entryPoint: 'https://idp.testshib.org/idp/profile/SAML2/Redirect/SSO',
  // Usually specified as `/shibboleth` from site root
  issuer: 'https://comped.cs.ubc.ca',
  identifierFormat: null,
  // Service Provider private key
  decryptionPvk: key,
  // Service Provider Certificate
  privateCert: key,
  // Identity Provider's public key
  cert: cert,
  validateInResponseTo: false,
  disableRequestedAuthnContext: true
}, function (profile, done) {
  console.log(profile);
  return done(null,
    profile);
  /* User.findOne({
    email: profile.email.toLowerCase()
  }, function (err, user) {
    if (err) return done(err);

    if (!user) {
      return done(null, false, { message: 'This student number is not registered.' });
    }
    if (!user.authenticate(password)) {
      return done(null, false, { message: 'This password is not correct.' });
    }
    return done(null, user);
  });*/
});

passport.use(samlStrategy);

module.exports = samlStrategy;
