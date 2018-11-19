const express = require("express");
const router = express.Router();

const { log, isAuthenticated } = require("../middlewares");
const controller = require("../controllers/categories");

router.get("/", isAuthenticated, log, controller.getAllCategories);
router.get(
  "/:id/topics",
  isAuthenticated,
  log,
  controller.getAllCategoryTopics
);

router.post("/", isAuthenticated, log, controller.createNewCategory);
router.post("/:id", isAuthenticated, log, controller.removeCategory);

router.put("/:id", isAuthenticated, log, controller.editCategory);

module.exports = router;
