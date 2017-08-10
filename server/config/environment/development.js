import path from "path";

// Development specific configuration
// ==================================
export default {
  ip: "127.0.0.1",

  httpsPort: 4444,
  httpPort: 8080,

  url: "https://localhost:4444",

  seedDB: true,

  // CWL
  callbackUrl: "https://127.0.0.1:4343/auth/cwl/login/callback",
  entryPoint:
    "https://authentication.stg.id.ubc.ca/idp/profile/SAML2/Redirect/SSO",
  idpCert: path.join(__dirname, "../../cert/idp_cert-staging.pem"),

  // MongoDB connection options
  mongo: {
    uri: "mongodb://localhost/its110-dev"
  }
};
