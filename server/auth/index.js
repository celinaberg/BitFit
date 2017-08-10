const express = require("express");
const cwl = require("./cwl");

const router = express.Router();

router.use("/cwl", cwl);

module.exports = router;
