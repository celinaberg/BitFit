import express from "express";
import { compile, run } from "./cli.controller";
import { isAuthenticated } from "../../auth/auth.service";

const router = express.Router();

router.post("/compile", isAuthenticated(), compile);
router.post("/run", isAuthenticated(), run);

export default router;
