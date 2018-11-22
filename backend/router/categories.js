const express = require("express");
const router = express.Router();

const { log, isAuthenticated, staff } = require("../middlewares");
const controller = require("../controllers/categories");

router.get("/", isAuthenticated, log, controller.getAllCategories);
router.get(
  "/:category/topics",
  isAuthenticated,
  log,
  controller.getAllCategoryTopics
);

router.post("/", isAuthenticated, staff, log, controller.createNewCategory);
router.post("/:id", isAuthenticated, staff, log, controller.removeCategory);

router.put("/:id", isAuthenticated, staff, log, controller.editCategory);

module.exports = router;
