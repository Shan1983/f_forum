const express = require("express");
const router = express.Router();

const controller = require("../controllers/like");
const { isAuthenticated, log } = require("../middlewares");

// router.get("/meta", isAuthenicated, log, controller.getLikeMeta);
router.post("/:topic/topic", isAuthenticated, log, controller.likeTopic);
router.post("/:reply/reply", isAuthenticated, log, controller.likeReply);
router.delete("/:id", isAuthenticated, log, controller.removeLike);

module.exports = router;
