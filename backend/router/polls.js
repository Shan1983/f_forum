const express = require("express");
const router = express.Router();

const controller = require("../controllers/poll");
const { isAuthenticated, staff, log } = require("../middlewares");

router.get("/:poll", isAuthenticated, log, controller.getPoll);
router.get("/", isAuthenticated, log, staff, controller.getAllPolls);
router.get("/:poll/results", isAuthenticated, log, controller.getPollResults);
router.post("/:topic/new", isAuthenticated, log, controller.createNewPoll);
router.post(
  "/:poll/:response/vote",
  isAuthenticated,
  log,
  controller.voteOnPoll
);
router.put("/:poll", isAuthenticated, log, controller.editPoll);
router.delete("/:poll", isAuthenticated, staff, log, controller.removePoll);

module.exports = router;
