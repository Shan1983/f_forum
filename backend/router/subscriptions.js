const express = require("express");
const router = express.Router();

const controller = require("../controllers/subscription");
const { isAuthenticated, staff, log } = require("../middlewares");

router.get("/:user", isAuthenticated, staff, log, controller.getUserSubs);
router.get("/:topic", isAuthenticated, log, controller.isUserSub);
router.post("/:topic", isAuthenticated, log, controller.subscribe);
router.put("/:id", isAuthenticated, log, controller.muteSubs);

module.exports = router;
