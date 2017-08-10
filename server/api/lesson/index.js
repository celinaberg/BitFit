import express from "express";
import controller from "./lesson.controller";
import auth from "../../auth/auth.service";

export default const router = express.Router();

router.get("/", controller.index);
// router.get('/:id', controller.show);
router.get("/:id", controller.show);
router.post("/", auth.hasRole("admin"), controller.create);
router.put("/:id", auth.hasRole("admin"), controller.update);
router.patch("/:id", auth.hasRole("admin"), controller.update);
router.delete("/:id", auth.hasRole("admin"), controller.destroy);
router.post(
  "/:id/delquestion",
  auth.hasRole("admin"),
  controller.deleteQuestion
);
router.post("/:id/questions", auth.hasRole("admin"), controller.addQuestion);
