const express = require("express");
const router = express.Router();

const controller = require("../controllers/like");
const { isAuthenicated, log } = require("../middlewares");

// router.get("/meta", isAuthenicated, log, controller.getLikeMeta);
router.post("/:topic/topic", isAuthenicated, log, controller.likeTopic);
router.post("/:reply/reply", isAuthenicated, log, controller.likeReply);
router.delete("/:id", isAuthenicated, log, controller.removeLike);

module.exports = router;
