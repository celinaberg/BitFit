const passport = require('passport')
const SamlStrategy = require('passport-saml').Strategy
const fs = require('fs')
const path = require('path')
const config = require('../../config/environment')
const User = require('../../api/user/user.model')

const uid = 'urn:oid:0.9.2342.19200300.100.1.1'
const memberOf = 'urn:oid:1.3.6.1.4.1.5923.1.5.1.1'
const groupMembership = 'urn:oid:2.16.840.1.113719.1.1.4.1.25'
const firstName = 'urn:oid:2.5.4.42'
const lastName = 'urn:oid:2.5.4.4'
const displayName = 'urn:oid:2.16.840.1.113730.3.1.241'
const studentNumber = 'urn:mace:dir:attribute-def:ubcEduStudentNumber'
const employeeNumber = 'urn:oid:2.16.840.1.113730.3.1.3'

const memberOfInstructors = 'cn=instructors,ou=comped.cs.ubc.ca,ou=applications,ou=cpsc-ubcv,ou=clients,dc=id,dc=ubc,dc=ca'
const memberOfTeachingAssistants = 'cn=teaching-assistants,ou=comped.cs.ubc.ca,ou=applications,ou=cpsc-ubcv,ou=clients,dc=id,dc=ubc,dc=ca'

passport.serializeUser((user, done) => {
  console.log('Serialize User')
  console.log(user)
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

const keyContents = fs.readFileSync(path.join(__dirname, '../../cert/key.pem'), 'utf8')

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
  let role = 'student'
  if (profile.hasOwnProperty(memberOf)) {
    if (profile[memberOf].includes(memberOfInstructors)) {
      role = 'instructor'
    } else if (profile[memberOf].includes(memberOfTeachingAssistants)) {
      role = 'teaching-assistant'
    }
  } else if (profile.hasOwnProperty(groupMembership)) {

  } else {
    // Unauthorized to access app
    return done(null, false, { message: 'You are not registered in APSC 160' })
  }

  User.findOne({
    // Check CWL login name
    uid: profile[uid]
  }, (err, user) => {
    if (err) return done(err)

    if (!user) {
      // create new user account
      user = new User({uid: profile[uid]})
    }

    user.role = role
    user.firstName = profile[firstName]
    user.lastName = profile[lastName]
    user.displayName = profile[displayName]
    user.role = role
    user.studentNumber = profile[studentNumber]
    user.employeeNumber = profile[employeeNumber]
    /*
    user.section =
    user.term =
    user.session =
    user.year =
    */

    user.save((err, user) => {
      if (err) done(err)
      return done(null, user)
    })
  })
})

passport.use(samlStrategy)

module.exports = samlStrategy
