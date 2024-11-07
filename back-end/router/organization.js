const express = require("express");
const { checkUserOrganization, createOrganization, 
    joinOrganization, getOrganizationsByUser, 
    updateOrganization, deleteOrganization,
    getOrganizationById, inviteMember,
    acceptInvitation, declineInvitation,
    removeMember, getOrganizationMembers} = require("../controller/organization.controller")
const { verifyToken } = require("../middleware/auth"); // Make sure to import your token verification middleware
const router = express.Router();

// Check if user is in any organization
router.get("/check-organization/:userId", verifyToken, checkUserOrganization);
router.post("/create", verifyToken, createOrganization);
router.post("/join-organization", verifyToken, joinOrganization); // Add this route
router.put("/update/:organizationId", verifyToken, updateOrganization);
router.get("/user/organizations", verifyToken, getOrganizationsByUser);
router.delete("/delete/:organizationId", verifyToken, deleteOrganization);
router.get("/:organizationId", verifyToken, getOrganizationById);
router.post("/invite", verifyToken, inviteMember); // Ensure this route is defined
router.post("/accept-invitation/:notificationId", verifyToken, acceptInvitation);
router.post("/decline-invitation/:notificationId", verifyToken, declineInvitation);
router.post("/removeMember", verifyToken, removeMember);
router.get('/:organizationId/members', verifyToken, getOrganizationMembers);

module.exports = router;
