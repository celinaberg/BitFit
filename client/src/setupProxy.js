const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/api", {
    target: "https://localhost:4444",
    secure: false
  }));
  app.use(proxy("/auth", {
    target: "https://localhost:4444",
    secure: false
  }));
};
