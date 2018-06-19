// @flow

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: "BitFit",
      script: "build/server/app.js",
      env: {
        NODE_ENV: "production"
      },
      watch: true,
      ignore_watch: ["users"]
    }
  ]
};
