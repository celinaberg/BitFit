// @flow

import passport from "passport";
import { Strategy as SamlStrategy } from "passport-saml";
import fs from "fs";
import path from "path";
import User from "../../api/user/user.model";

const uid = "urn:oid:0.9.2342.19200300.100.1.1";
const groupMembership = "urn:oid:2.16.840.1.113719.1.1.4.1.25";
const firstName = "urn:oid:2.5.4.42";
const lastName = "urn:oid:2.5.4.4";
const displayName = "urn:oid:2.16.840.1.113730.3.1.241";
const studentNumber = "urn:mace:dir:attribute-def:ubcEduStudentNumber";
const employeeNumber = "urn:oid:2.16.840.1.113730.3.1.3";

const memberOfInstructors =
  "cn=instructors,ou=comped.cs.ubc.ca,ou=applications,ou=cpsc-ubcv,ou=clients,dc=id,dc=ubc,dc=ca";
const memberOfTeachingAssistants =
  "cn=teaching-assistants,ou=comped.cs.ubc.ca,ou=applications,ou=cpsc-ubcv,ou=clients,dc=id,dc=ubc,dc=ca";
const memberOfAPSC160StudentsRegex = /cn=apsc_160_\w+_\w+,ou=apsc,ou=ubc,ou=academic,dc=id,dc=ubc,dc=ca/i;

passport.serializeUser((user, done) => {
  //console.log("serialize user", user);
  return done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  //console.log("deserialize user", userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return done(null, false);
    } else {
      //console.log("deserialized user", user);
      return done(null, user);
    }
  } catch (err) {
    return done(err);
  }
});

const keyContents = fs.readFileSync(
  path.join(__dirname, "../../cert/key.pem"),
  "utf8"
);

/* Checks if `str` appears in array `arr`, ignoring case.
Useful for doing case-insensitive LDAP comparisons.
*/
function caseInsensitiveIncludes(arr, str) {
  return arr.some(s => s.toUpperCase() === str.toUpperCase());
}

const samlStrategy = new SamlStrategy(
  {
    // URL that goes from the Identity Provider -> Service Provider
    callbackUrl: "https://comped.cs.ubc.ca/auth/cwl/login/callback",
    // URL that goes from the Service Provider -> Identity Provider
    entryPoint: "https://authentication.ubc.ca/idp/profile/SAML2/Redirect/SSO",
    // Usually specified as `/shibboleth` from site root
    issuer: "https://comped.cs.ubc.ca",
    identifierFormat: null,
    // Service Provider private key
    decryptionPvk: keyContents,
    // Service Provider Certificate
    privateCert: keyContents,
    // Identity Provider's public key
    cert: fs.readFileSync(
      path.join(__dirname, "../../cert/idp_cert.pem"),
      "utf8"
    ),
    validateInResponseTo: false,
    disableRequestedAuthnContext: true
  },
  async (profile, done) => {
    let role;
    if (profile.hasOwnProperty(groupMembership)) {
      if (caseInsensitiveIncludes(profile[groupMembership], memberOfInstructors)) {
        role = "instructor";
      } else if (caseInsensitiveIncludes(profile[groupMembership], memberOfTeachingAssistants)) {
        role = "teaching-assistant";
      } else if (profile[groupMembership].some(s => memberOfAPSC160StudentsRegex.test(s))) {
        role = "student";
        // Temp: Restrict access to students.
        return done(null, false, {
          message: "Students are currently not allowed to access BitFit."
        });
      } else {
        // Unauthorized to access app
        return done(null, false, {
          message: "You are not registered in APSC 160"
        });
      }
    } else {
      // Unauthorized to access app
      return done(null, false, {
        message: "You are not registered in APSC 160"
      });
    }

    User.findOne(
      {
        // Check CWL login name
        uid: profile[uid]
      },
      (err, user) => {
        if (err) return done(err);

        if (!user) {
          // create new user account
          user = new User({ uid: profile[uid] });
        }
        user.firstName = profile[firstName];
        user.lastName = profile[lastName];
        user.displayName = profile[displayName];
        user.role = role;
        user.studentNumber = profile[studentNumber];
        user.employeeNumber = profile[employeeNumber];
        /*
    user.section =
    user.term =
    user.session =
    user.year =
    */

        user.save((err, user) => {
          if (err) return done(err);
          return done(null, user);
        });
      }
    );
  }
);

passport.use(samlStrategy);

export default samlStrategy;
