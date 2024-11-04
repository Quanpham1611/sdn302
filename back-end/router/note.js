const express = require("express");
const { verifyToken } = require("../middleware/auth"); // Make sure to import your token verification middleware
const router = express.Router();
const {getNotes} = require("../controller/note.controller");

router.get('/individual',verifyToken, getNotes);

module.exports = router;

