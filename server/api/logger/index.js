// @flow

import express from "express";
import { index, show, update, getForQuestion } from "./logger.controller";
import { hasRole, isAuthenticated } from "../../auth/auth.service";

const router = express.Router();

router.get("/", hasRole("admin"), index);
router.get("/q/:id", isAuthenticated(), getForQuestion);
router.get("/:id", isAuthenticated(), show);
router.post("/:id", isAuthenticated(), update);

export default router;
