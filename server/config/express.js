/**
 * Express configuration
 */

const express = require("express");
// var favicon = require('serve-favicon');
const morgan = require("morgan");
const compression = require("compression");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const errorHandler = require("errorhandler");
const path = require("path");
const config = require("./environment");
const passport = require("passport");
const ejs = require("ejs");
// const connectLivereload = require('connect-livereload')
const session = require("express-session");

function init(app) {
  const env = app.get("env");

  app.disable("x-powered-by");
  app.set("views", path.join(config.root, "/server/views"));
  app.engine("html", ejs.renderFile);
  app.set("view engine", "html");
  app.set("appPath", "client");

  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(
    session({
      secret: "TODO: MAKE ME AN ENV VAR!!!",
      cookie: {
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: null
      },
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(morgan("dev"));

  app.use(express.static(path.join(__dirname, "../../build/client")));

  if (env === "development" || env === "test") {
    // app.use(connectLivereload())
    app.use(errorHandler()); // Error handler - has to be last
  }

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Internal error. Please try again later.");
  });
}

module.exports = init;
