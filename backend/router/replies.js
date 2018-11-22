const express = require("express");
const router = express.Router();

const controller = require("../controllers/replies");
const { isAuthenticated, staff, log } = require("../middlewares");

router.get("/:topic", isAuthenticated, log, controller.getReplies);
router.post("/:topic", isAuthenticated, log, controller.postreply);
// router.post("/:topic/reply/like", isAuthenticated, log, controller.likereply);
router.put("/:id", isAuthenticated, log, controller.editreply);
router.delete("/:id", isAuthenticated, staff, log, controller.removereply);

module.exports = router;
