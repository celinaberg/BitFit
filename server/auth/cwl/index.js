// @flow

import type { $Request, $Response } from "express";

import express from "express";
import passport from "passport";
import strategy from "./passport";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/metadata", (req: $Request, res: $Response) => {
  res.set("Content-Type", "text/xml");
  const cert = fs.readFileSync(
    path.join(__dirname, "/../../cert/cert.pem"),
    "utf8"
  );
  res.send(strategy.generateServiceProviderMetadata(cert));
});

router.get(
  "/login",
  passport.authenticate("saml", {
    successRedirect: "/lessons",
    failureRedirect: "/auth/cwl/login/failed"
  })
);

router.get("/login/failed", (req: $Request, res: $Response) => {
  res
    .status(401)
    .send(
      "You are not authorized to use BitFit. If you think this is an error, please contact the course instructor."
    );
});

router.post(
  "/login",
  passport.authenticate("saml", {
    successRedirect: "/lessons",
    failureRedirect: "/auth/cwl/login/failed"
  })
);

router.post(
  "/login/callback",
  passport.authenticate("saml", {
    successRedirect: "/lessons",
    failureRedirect: "/auth/cwl/login/failed"
  })
);

router.get("/logout", (req: $Request, res: $Response) => {
  req.logout();
  res.redirect("/");
});

export default router;
