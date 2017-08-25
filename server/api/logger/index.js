// @flow

import express from "express";
import { index, show, create, update, destroy } from "./logger.controller";
import { hasRole, isAuthenticated } from "../../auth/auth.service";

const router = express.Router();

router.get("/", index);
router.get("/:id", isAuthenticated(), show);
router.post("/", isAuthenticated(), create);
router.put("/:id", isAuthenticated(), update);
router.patch("/:id", isAuthenticated(), update);
router.delete("/:id", hasRole("admin"), destroy);

export default router;
