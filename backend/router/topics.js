const express = require("express");
const router = express.Router();

const controller = require("../controllers/topics");

const { log, isAuthenticated, staff } = require("../middlewares/index");

router.get(
  "/:category/all",
  isAuthenticated,
  log,
  controller.allCategoryTopics
);
router.get("/:id", isAuthenticated, log, controller.getTopic);
router.get(
  "/:category/topics/deleted",
  isAuthenticated,
  staff,
  log,
  controller.getDeletedTopics
);

router.post("/:category/", isAuthenticated, log, controller.createNewTopic);
router.post("/:topic/lock", isAuthenticated, staff, log, controller.lockTopic);
router.post(
  "/:topic/sticky",
  isAuthenticated,
  staff,
  log,
  controller.makeTopicSticky
);
router.post("/:topic/move", isAuthenticated, staff, log, controller.moveTopic);
router.post("/:topic/color", isAuthenticated, log, controller.changeTopicColor);
// router.post("/:topic/like", isAuthenticated, log, controller.changeTopicColor);

router.put("/:topic/edit", isAuthenticated, log, controller.editTopic);

router.delete("/:topic", isAuthenticated, staff, log, controller.deleteTopic);

module.exports = router;
