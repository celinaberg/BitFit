// @flow

/**
 * Express configuration
 */

import type { $Application, $Request, $Response } from "express";

import express from "express";
// var favicon from 'serve-favicon';
import morgan from "morgan";
import compression from "compression";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import errorHandler from "errorhandler";
import path from "path";
import config from "./environment";
import passport from "passport";
import ejs from "ejs";
// import connectLivereload from 'connect-livereload';
import session from "express-session";
import ConnectMongo from "connect-mongo";

export default function init(app: $Application, connection) {
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
  const MongoStore = ConnectMongo(session);
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
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: connection
      })
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(morgan("dev"));

  app.use(express.static(path.join(__dirname, "../../client")));

  if (env === "development" || env === "test") {
    // app.use(connectLivereload())
    app.use(errorHandler()); // Error handler - has to be last
  }
  // eslint-disable-next-line no-unused-vars
  app.use(function(err, req: $Request, res: $Response, next) {
    console.error(err.stack);
    res.status(500).send("Internal error. Please try again later.");
  });
}
