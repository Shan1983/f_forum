const express = require("express");
const router = express.Router();

const controller = require("../controllers/rewards");
const { isAuthenticated, log, admin } = require("../middlewares");

router.put("/", isAuthenticated, admin, log, controller.updateRewards);

module.exports = router;
