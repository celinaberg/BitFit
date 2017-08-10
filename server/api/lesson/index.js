import express from "express";
import {
  index,
  show,
  create,
  update,
  destroy,
  deleteQuestion,
  addQuestion
} from "./lesson.controller";
import { hasRole } from "../../auth/auth.service";

const router = express.Router();

router.get("/", index);
// router.get('/:id', controller.show);
router.get("/:id", show);
router.post("/", hasRole("admin"), create);
router.put("/:id", hasRole("admin"), update);
router.patch("/:id", hasRole("admin"), update);
router.delete("/:id", hasRole("admin"), destroy);
router.post("/:id/delquestion", hasRole("admin"), deleteQuestion);
router.post("/:id/questions", hasRole("admin"), addQuestion);

export default router;
