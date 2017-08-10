import path from "path";
import _ from "lodash";

import development from "./development";

// All configurations will extend these options
// ============================================
let all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.join(__dirname, "/../../.."),

  ip: "0.0.0.0",

  // Server port
  httpsPort: 443,
  httpPort: 80,

  url: "https://comped.cs.ubc.ca",

  // Should we populate the DB with sample data?
  seedDB: false, // fixme?

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: "its110-secret"
  },

  // List of user roles
  userRoles: ["guest", "student", "teaching-assistant", "instructor"],

  // CWL
  callbackUrl: "https://comped.cs.ubc.ca/auth/cwl/login/callback",
  entryPoint: "https://authentication.ubc.ca/idp/profile/SAML2/Redirect/SSO",
  idpCert: path.join(__dirname, "../../cert/idp_cert.pem"),

  // MongoDB connection options
  mongo: {
    uri: "mongodb://localhost/its110",
    options: {
      useMongoClient: true
    }
  }
};

if (all.env === "development") {
  all = _.merge(all, development);
}

// Export the config object based on the NODE_ENV
// ==============================================
export default all;
