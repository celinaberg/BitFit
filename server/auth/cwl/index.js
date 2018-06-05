// @flow

import type { $Request, $Response, $NextFunction } from "express";

import express from "express";
import passport from "passport";
import strategy from "./passport";
import fs from "fs";
import path from "path";
import User from "../../api/user/user.model";

const router = express.Router();

const devmodeon = process.env.NODE_ENV === "development";

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
  async (req: $Request, res: $Response, next: $NextFunction) => {
    if (devmodeon) {
      try {
        let backDoorUser = await User.findOne({
          uid: "buser"
        });
        req.login(backDoorUser, function(err) {
          if (err) { return next(err); }
          res.redirect("/lessons");
        });
      } catch (err) {
        res.status(401).send(err);
      }
    } else {
      passport.authenticate("saml", {
        successRedirect: "/lessons",
        failureRedirect: "/auth/cwl/login/failed"
      });
    }
  }
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
  async (req: $Request, res: $Response, next: $NextFunction) => {
    if (devmodeon) {
      try {
        let backDoorUser = await User.findOne({
          uid: "buser"
        });
        req.login(backDoorUser, function(err) {
          if (err) { return next(err); }
          res.redirect("/lessons");
        });
      } catch (err) {
        res.status(401).send(err);
      }
    } else {
      passport.authenticate("saml", {
        successRedirect: "/lessons",
        failureRedirect: "/auth/cwl/login/failed"
      });
    }
  }
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
