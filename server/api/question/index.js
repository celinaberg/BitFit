import express from "express";
import controller from "./question.controller";

const router = express.Router();

router.get("/export", controller.exportQuestions);
router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", controller.create);
router.post("/import", controller.importQuestions);
router.put("/:id", controller.update);
router.patch("/:id", controller.update);
router.delete("/:id", controller.destroy);

export default router;
