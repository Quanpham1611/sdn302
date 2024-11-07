const express = require("express");
const { getAllUsers, getUserById } = require("../controller/user.controller");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.get("/allUsers", verifyToken, getAllUsers);
router.get("/:userId", verifyToken, getUserById);

module.exports = router;