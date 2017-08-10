const express = require("express");
const controller = require("./logger.controller");
const auth = require("../../auth/auth.service");

const router = express.Router();

router.get("/", controller.index);
router.get("/:id", auth.isAuthenticated(), controller.show);
router.post("/", auth.isAuthenticated(), controller.create);
router.put("/:id", auth.isAuthenticated(), controller.update);
router.patch("/:id", auth.isAuthenticated(), controller.update);
router.delete("/:id", auth.hasRole("admin"), controller.destroy);

module.exports = router;
