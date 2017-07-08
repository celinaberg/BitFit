var passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy;
var fs = require('fs');
var path = require('path');

exports.setup = function (User, config) {
  var samlStrategy = new SamlStrategy({
    // URL that goes from the Identity Provider -> Service Provider
    callbackUrl: 'https://127.0.0.1:4343/auth/cwl/login/callback',
    // URL that goes from the Service Provider -> Identity Provider
    // entryPoint: 'https://authentication.ubc.ca',
    entryPoint: 'https://authentication.stg.id.ubc.ca',
    // Usually specified as `/shibboleth` from site root
    issuer: 'https://comped.cs.ubc.ca',
    identifierFormat: null,
    // Service Provider private key
    // decryptionPvk: fs.readFileSync(path.join(__dirname, '/../../cert/key.pem'), 'utf8'),
    // Service Provider Certificate
    // privateCert: fs.readFileSync(path.join(__dirname, '/../../cert/key.pem'), 'utf8'),
    // Identity Provider's public key
    // cert: fs.readFileSync(path.join(__dirname, '/../../cert/idp_cert.pem'), 'utf8'),
    validateInResponseTo: false,
    disableRequestedAuthnContext: true
  }, function (profile, done) {
    User.findOne({
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
    });
  });

  passport.use(samlStrategy);
};
