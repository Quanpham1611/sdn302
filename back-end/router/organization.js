const express = require("express");
const { checkUserOrganization, createOrganization, joinOrganization } = require("../controller/organization.controller")
const { verifyToken } = require("../middleware/auth"); // Make sure to import your token verification middleware
const router = express.Router();

// Check if user is in any organization
router.get("/check-organization/:userId", verifyToken, checkUserOrganization);
router.post("/create", verifyToken, createOrganization);
router.post("/join-organization", verifyToken, joinOrganization); // Add this route

module.exports = router;
