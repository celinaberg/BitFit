import express from "express";
import controller from "./user.controller";
import auth from "../../auth/auth.service";

const router = express.Router();

router.get("/", auth.hasRole("admin"), controller.index);
router.delete("/:id", auth.hasRole("admin"), controller.delete);
router.get("/me", auth.isAuthenticated(), controller.me);
router.get("/:id", auth.isAuthenticated(), controller.show);

export default router;
