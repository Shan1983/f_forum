const express = require("express");
const router = express.Router();

const { log } = require("../middlewares");
const controller = require("../controllers/users");

router.get("/", log, controller.getAll);
router.get("/:id", log, controller.getSingle);
router.get("/profile/:id", log, controller.getProfile);
router.get("/:id/avatar", log, controller.getAvatar);
router.get("/verify/email/:token", log, controller.verifyEmail);

router.post("/login", log, controller.login);
router.post("/register", log, controller.register);
router.post("/logout", log, controller.logout);
router.post("/profile/:id/upload", log, controller.upload);
router.post("/profile/:id/close", log, controller.closeAccount);

router.put("/profile/:id", log, controller.updateProfile);

router.delete("/:id", log, controller.destroy);

module.exports = router;
