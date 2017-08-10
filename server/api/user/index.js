import express from "express";
import { index, destroy, me, show } from "./user.controller";
import { hasRole, isAuthenticated } from "../../auth/auth.service";

const router = express.Router();

router.get("/", hasRole("admin"), index);
router.delete("/:id", hasRole("admin"), destroy);
router.get("/me", isAuthenticated(), me);
router.get("/:id", isAuthenticated(), show);

export default router;
