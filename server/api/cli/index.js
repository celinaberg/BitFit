// @flow

import express from "express";
import { compileLogger, runLogger } from "./cli.controller";
import { isAuthenticated } from "../../auth/auth.service";

const router = express.Router();

router.get("/compile/:id", isAuthenticated(), compileLogger);
router.get("/run/:id", isAuthenticated(), runLogger);

// router.post("/compile", isAuthenticated(), compile);
// router.post("/run", isAuthenticated(), run);

export default router;
