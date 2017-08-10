import express from "express";
import controller from "./logger.controller";
import auth from "../../auth/auth.service";

export default const router = express.Router();

router.get("/", controller.index);
router.get("/:id", auth.isAuthenticated(), controller.show);
router.post("/", auth.isAuthenticated(), controller.create);
router.put("/:id", auth.isAuthenticated(), controller.update);
router.patch("/:id", auth.isAuthenticated(), controller.update);
router.delete("/:id", auth.hasRole("admin"), controller.destroy);
