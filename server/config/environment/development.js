// @flow

// Development specific configuration
// ==================================
export default {
  env: "development",

  ip: "127.0.0.1",

  httpsPort: 4444,
  httpPort: 8080,

  url: "https://localhost:4444",

  seedDB: true,

  // MongoDB connection options
  mongo: {
    uri: "mongodb://localhost/its110-dev"
  }
};
