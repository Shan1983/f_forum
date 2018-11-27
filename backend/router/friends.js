const express = require("express");
const router = express.Router();

const controller = require("../controllers/friends");
const { log, isAuthenticated } = require("../middlewares");

router.get("/:user", isAuthenticated, log, controller.getFriends);
router.post("/:reciever", isAuthenticated, log, controller.sendFriendRequest);
router.post("/:sender/accept", isAuthenticated, log, controller.addFriend);
router.delete("/:id", isAuthenticated, log, controller.removeFriend);

module.exports = router;
