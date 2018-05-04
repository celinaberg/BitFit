// @flow

import passport from "passport";
import { Strategy as SamlStrategy } from "passport-saml";
import fs from "fs";
import path from "path";
import config from "../../config/environment";
import User from "../../api/user/user.model";

const uid = "urn:oid:0.9.2342.19200300.100.1.1";
const memberOf = "urn:oid:1.3.6.1.4.1.5923.1.5.1.1";
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

const samlStrategy = new SamlStrategy(
  {
    // URL that goes from the Identity Provider -> Service Provider
    callbackUrl: config.callbackUrl,
    // URL that goes from the Service Provider -> Identity Provider
    entryPoint: config.entryPoint,
    // Usually specified as `/shibboleth` from site root
    issuer: "https://comped.cs.ubc.ca",
    identifierFormat: null,
    // Service Provider private key
    decryptionPvk: keyContents,
    // Service Provider Certificate
    privateCert: keyContents,
    // Identity Provider's public key
    cert: fs.readFileSync(config.idpCert, "utf8"),
    validateInResponseTo: false,
    disableRequestedAuthnContext: true
  },
  async (profile, done) => {
    let role;
    if (profile.hasOwnProperty(memberOf)) {
      if (profile[memberOf].includes(memberOfInstructors)) {
        role = "instructor";
      } else if (profile[memberOf].includes(memberOfTeachingAssistants)) {
        role = "teaching-assistant";
      }
    } else if (profile.hasOwnProperty(groupMembership)) {
      role = "student";
      // Temp: Restrict access to students.
      return done(null, false, {
        message: "Students are currently not allowed to access BitFit."
      });
    } else {
      // Unauthorized to access app
      // TODO: Backdoor - remove
      if (config.env === "development") {
        try {
          let backDoorUser = await User.findOne({
            uid: "buser"
          });
          return done(null, backDoorUser);
        } catch (err) {
          return done(err);
        }
      } else {
        return done(null, false, {
          message: "You are not registered in APSC 160"
        });
      }
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
