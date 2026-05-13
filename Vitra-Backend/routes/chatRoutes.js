const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const { getChatThread } = require("../controller/chatController");

router.get("/:appointmentId", authMiddleware, getChatThread);

module.exports = router;