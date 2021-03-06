// @flow

import express from "express";
import {
  index,
  show,
  create,
  update,
  destroy,
  getQuestions
} from "./lesson.controller";
import { hasRole } from "../../auth/auth.service";

const router = express.Router();

router.get("/:id", getQuestions);
router.get("/", index);
router.get("/:id", show);
router.post("/", hasRole("admin"), create);
router.put("/:id", hasRole("admin"), update);
router.patch("/:id", hasRole("admin"), update);
router.delete("/:id", hasRole("admin"), destroy);

export default router;
