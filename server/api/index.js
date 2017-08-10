import express from "express";
import Logger from "./logger";
import CLIs from "./cli";
import Lesson from "./lesson";
import Question from "./question";
import User from "./user";

const router = express.Router();

router.use("/loggers", Logger);
router.use("/clis", CLIs);
router.use("/lessons", Lesson);
router.use("/questions", Question);
router.use("/users", User);

export default router;
