// @flow

/**
 * Main application routes
 */

import type { $Application, $Request, $Response } from "express";

import Api from "./api";
import Auth from "./auth";
import { pageNotFound } from "./components/errors";
import path from "path";

function defaultRouteHandler(req: $Request, res: $Response) {
  res.render(path.join(__dirname, "../client/index.html"));
}

export default function init(app: $Application) {
  app.use("/api", Api);

  app.use("/auth", Auth);

  // All undefined asset or api routes should return a 404
  app
    .route("/:url(api|auth|components|app|bower_components|assets)/*")
    .get(pageNotFound);

  // All other routes should redirect to the index.html
  app.route("/*").get(defaultRouteHandler);
}
