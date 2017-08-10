/**
 * Main application routes
 */

import Api from "./api";
import Auth from "./auth";
import { pageNotFound } from "./components/errors";
import path from "path";

function defaultRouteHandler(req, res) {
  res.render(path.join(__dirname, "../client/index.html"));
}

export default function init(app) {
  app.use("/api/v2.0", Api);

  app.use("/auth", Auth);

  // All undefined asset or api routes should return a 404
  app
    .route("/:url(api|auth|components|app|bower_components|assets)/*")
    .get(pageNotFound);

  // All other routes should redirect to the index.html
  app.route("/*").get(defaultRouteHandler);
}
