const express = require("express");
const Logger = require("./logger");
const CLIs = require("./cli");
const Lesson = require("./lesson");
const Question = require("./question");
const User = require("./user");

const router = express.Router();

router.use("/loggers", Logger);
router.use("/clis", CLIs);
router.use("/lessons", Lesson);
router.use("/questions", Question);
router.use("/users", User);

module.exports = router;
