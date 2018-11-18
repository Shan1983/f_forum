const express = require("express");
const router = express.Router();

const { log } = require("../middlewares");

router.get("/", log, (req, res) => {
  res.json({ status: "Ok" });
});

module.exports = router;
