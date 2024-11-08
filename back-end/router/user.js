const express = require("express");
const { getAllUsers, getUserById,
    getUserInfo, search
 } = require("../controller/user.controller");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.get("/allUsers", verifyToken, getAllUsers);
router.get('/search', verifyToken, search);
router.get("/:userId", verifyToken, getUserById);
router.get('/:userId/info', verifyToken, getUserInfo);

module.exports = router;