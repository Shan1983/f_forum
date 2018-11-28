const express = require("express");
const router = express.Router();

const controller = require("../controllers/subscription");
const { isAuthenicated, staff, log } = require("../middlewares");

router.get("/:user", isAuthenicated, staff, log, controller.getUserSubs);
router.get("/:topic", isAuthenicated, log, controller.isUserSub);
router.post("/:topic", isAuthenicated, log, controller.subscribe);
router.put("/:id", isAuthenicated, log, controller.muteSubs);

module.exports = router;
