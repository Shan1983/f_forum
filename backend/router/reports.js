const express = require("express");
const router = express.Router();

const controller = require("../controllers/reports");

const { isAuthenticated, log, staff } = require("../middlewares");

router.get("/", isAuthenticated, log, controller.getAllReports);
router.post("/", isAuthenticated, log, controller.createReport);
router.delete("/:id", isAuthenticated, staff, log, controller.removeReport);

module.exports = router;
