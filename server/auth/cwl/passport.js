const passport = require('passport')
const SamlStrategy = require('passport-saml').Strategy
const fs = require('fs')
const path = require('path')
const config = require('../../config/environment')
const User = require('../../api/user/user.model')
const key = require('../../cert/key.pem')

passport.serializeUser((user, done) => {
  console.log('Serialize User')
  console.log(user)
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

const keyContents = fs.readFileSync(key, 'utf8')

const samlStrategy = new SamlStrategy({
  // URL that goes from the Identity Provider -> Service Provider
  // callbackUrl: 'https://127.0.0.1:4343/auth/cwl/login/callback',
  callbackUrl: config.callbackUrl,
  // URL that goes from the Service Provider -> Identity Provider
  // entryPoint: 'https://authentication.ubc.ca',
  entryPoint: config.entryPoint,
  // entryPoint: 'https://idp.testshib.org/idp/profile/SAML2/Redirect/SSO',
  // Usually specified as `/shibboleth` from site root
  issuer: 'https://comped.cs.ubc.ca',
  identifierFormat: null,
  // Service Provider private key
  decryptionPvk: keyContents,
  // Service Provider Certificate
  privateCert: keyContents,
  // Identity Provider's public key
  cert: fs.readFileSync(config.idpCert, 'utf8'),
  validateInResponseTo: false,
  disableRequestedAuthnContext: true
}, (profile, done) => {
  console.log(profile)
  return done(null,
    profile)
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
  }); */
})

passport.use(samlStrategy)

module.exports = samlStrategy
