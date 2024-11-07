const express = require("express");
const { getNotificationsByUserId } = require("../controller/notification.controller");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.get("/:userId", verifyToken, getNotificationsByUserId);

module.exports = router;