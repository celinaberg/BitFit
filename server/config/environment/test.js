// @flow

// Test specific configuration
// ===========================
export default {
  env: "test",

  seedDB: true,

  // MongoDB connection options
  mongo: {
    uri: "mongodb://localhost/its110-test"
  }
};
