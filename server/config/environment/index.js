// @flow

import path from "path";
import _ from "lodash";

import development from "./development";
import test from "./test";

// All configurations will extend these options
// ============================================
let all = {
  env: "production",

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

  // MongoDB connection options
  mongo: {
    uri: "mongodb://localhost/its110",
    options: {
      useMongoClient: true
    }
  }
};

if (process.env.NODE_ENV === "development") {
  all = _.merge(all, development);
} else if (process.env.NODE_ENV === "test") {
  all = _.merge(all, test);
}

// Export the config object based on the NODE_ENV
// ==============================================
export default all;
