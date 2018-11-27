const express = require("express");
const router = express.Router();

const controller = require("../controllers/penalty");
const { isAuthenticated, staff, log } = require("../middlewares");

router.get("/", isAuthenticated, staff, log, controller.getAll);
router.post("/:id", isAuthenticated, staff, log, controller.putInTheBox);
router.put("/:id", isAuthenticated, staff, log, controller.editUserPenalty);
router.delete(
  "/:id",
  isAuthenticated,
  staff,
  log,
  controller.removeUserPenalty
);

module.exports = router;
