import express from "express";
import {
  exportQuestions,
  index,
  show,
  create,
  importQuestions,
  update,
  destroy
} from "./question.controller";

const router = express.Router();

router.get("/export", exportQuestions);
router.get("/", index);
router.get("/:id", show);
router.post("/", create);
router.post("/import", importQuestions);
router.put("/:id", update);
router.patch("/:id", update);
router.delete("/:id", destroy);

export default router;
