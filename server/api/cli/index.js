import express from "express";
import controller from "./cli.controller";
import auth from "../../auth/auth.service";

export default const router = express.Router();

router.post("/compile", auth.isAuthenticated(), controller.compile);
router.post("/run", auth.isAuthenticated(), controller.run);
