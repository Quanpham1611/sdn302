const Organization = require("../model/organiztion");
const User = require("../model/user");
const Team = require("../model/team"); // Import the Team model
const Notification = require("../model/notification"); // Import the Notification model

// Check if user is in any organization
const checkUserOrganization = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Tìm người dùng và lấy danh sách tổ chức mà họ tham gia
        const user = await User.findById(userId).populate("organization");

        if (!user || user.organization.length === 0) {
            // Nếu người dùng không tồn tại hoặc không tham gia tổ chức nào
            return res.status(200).json({
                message: "User is not in any organization",
            });
        }

        // Nếu người dùng có tham gia tổ chức
        return res.status(200).json({
            message: "User is in one or more organizations",
            organizations: user.organization,
        });
    } catch (error) {
        console.error("Error checking user's organizations:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// Update organization
const updateOrganization = async (req, res) => {
    const organizationId = req.params.organizationId;
    const { name, description } = req.body;
    const userId = req.userId; // Get userId from the request (after authentication)

    try {
        // Find the organization by ID
        const organization = await Organization.findById(organizationId);

        if (!organization) {
            return res.status(404).json({ message: "Organization not found." });
        }

        // Check if the user is the owner of the organization
        if (organization.ownerBy.toString() !== userId) {
            return res.status(403).json({ message: "You do not have permission to update this organization." });
        }

        // Update the organization details
        organization.name = name;
        organization.description = description;

        await organization.save();

        return res.status(200).json({
            message: "Organization updated successfully.",
            organization,
        });
    } catch (error) {
        console.error("Error updating organization:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


const createOrganization = async (req, res) => {
    const { name, description, ownerBy } = req.body; // Add ownerBy to destructured variables
    const userId = req.userId; // Get userId from the request (after authentication)

    try {
        const newOrganization = new Organization({
            name,
            description,
            createdBy: userId, // The user creating the organization
            ownerBy: ownerBy || userId, // Default to the creator if ownerBy is not provided
        });

        await newOrganization.save();
        console.log(userId);
        
        await User.findByIdAndUpdate(userId, {
            $push: { organization: newOrganization._id } // Thêm organization mới vào danh sách organization của user
        });
        return res.status(201).json({
            message: "Organization created successfully!",
            organization: newOrganization,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const joinOrganization = async (req, res) => {
    const { organizationId } = req.body;
    const userId = req.userId;    

    try {
        console.log("Organization ID from request:", organizationId);

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { organizations: organizationId } }, // Adds organizationId only if not present
            { new: true } // Returns the updated document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: "Successfully joined the organization.",
            organizations: user.organizations,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const getOrganizationsByUser = async (req, res) => {
    const userId = req.userId;

    try {
        // Tìm người dùng và lấy thông tin chi tiết của các tổ chức họ tham gia
        const user = await User.findById(userId).populate({
            path: "organization",
            populate: [
                { path: "createdBy", select: "username email" },
                { path: "ownerBy", select: "username email" }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!user.organization || user.organization.length === 0) {
            return res.status(200).json({
                message: "User is not in any organization.",
                organizations: []
            });
        }

        // Tạo danh sách tổ chức kèm theo canEdit và canDelete
        const organizationsWithPermissions = user.organization.map(org => ({
            ...org.toObject(),
            canEdit: org.ownerBy._id.toString() === userId,
            canDelete: org.ownerBy._id.toString() === userId
        }));

        // Trả về danh sách tổ chức với thông tin quyền
        return res.status(200).json({
            message: "User's organizations retrieved successfully.",
            organizations: organizationsWithPermissions
        });
    } catch (error) {
        console.error("Error fetching organizations for user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const deleteOrganization = async (req, res) => {
    const organizationId = req.params.organizationId;
    const userId = req.userId; // Get userId from the request (after authentication)

    try {
        // Find the organization by ID
        const organization = await Organization.findById(organizationId);

        if (!organization) {
            return res.status(404).json({ message: "Organization not found." });
        }

        // Check if the user is the owner of the organization
        if (organization.ownerBy.toString() !== userId) {
            return res.status(403).json({ message: "You do not have permission to delete this organization." });
        }

        // Remove the organization from the user's organization list
        await User.updateMany(
            { organization: organizationId },
            { $pull: { organization: organizationId } }
        );

        // Delete the organization
        await organization.remove();

        return res.status(200).json({ message: "Organization deleted successfully." });
    } catch (error) {
        console.error("Error deleting organization:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const getOrganizationById = async (req, res) => {
    const organizationId = req.params.organizationId;

    try {
        const organization = await Organization.findById(organizationId)
            .populate({
                path: 'teams',
                populate: {
                    path: 'members',
                    select: 'username'
                }
            })
            .populate('ownerBy', 'username'); // Populate ownerBy with username

        if (!organization) {
            return res.status(404).json({ message: "Organization not found." });
        }

        // Populate members from User model
        const members = await User.find({ organization: organizationId }).select('username');

        return res.status(200).json({ organization, members });
    } catch (error) {
        console.error("Error fetching organization details:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const inviteMember = async (req, res) => {
    const { organizationId, username } = req.body;
    
    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const organization = await Organization.findById(organizationId);

        if (!organization) {
            return res.status(404).json({ message: "Organization not found." });
        }

        // Create a notification for the user
        const notification = new Notification({
            user_id: user._id,
            organization_id: organizationId,
            message: `Bạn đã được mời vào tổ chức ${organization.name}.`
        });

        await notification.save();

        return res.status(200).json({ message: "Member invited successfully. Notification sent." });
    } catch (error) {
        console.error("Error inviting member:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const acceptInvitation = async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.userId;

    try {
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(403).json({ message: "Notification not found." });
        }

        if (notification.user_id.toString() !== userId) {
            return res.status(403).json({ message: "You do not have permission to accept this invitation." });
        }

        // Add user to the organization
        await User.findByIdAndUpdate(userId, {
            $addToSet: { organization: notification.organization_id }
        });

        // Update notification status to "read"
        notification.status = "read";
        await notification.save();

        return res.status(200).json({ message: "Invitation accepted successfully." });
    } catch (error) {
        console.error("Error accepting invitation:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const declineInvitation = async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.userId;

    try {
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(403).json({ message: "Notification not found." });
        }

        if (notification.user_id.toString() !== userId) {
            return res.status(403).json({ message: "You do not have permission to decline this invitation." });
        }

        // Update notification status to "read"
        notification.status = "read";
        await notification.save();

        return res.status(200).json({ message: "Invitation declined successfully." });
    } catch (error) {
        console.error("Error declining invitation:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const removeMember = async (req, res) => {
    const { organizationId, memberId } = req.body;
    const userId = req.userId; // Get userId from the request (after authentication)

    try {
        // Find the organization by ID
        const organization = await Organization.findById(organizationId);

        if (!organization) {
            return res.status(404).json({ message: "Organization not found." });
        }

        // Check if the user is the owner of the organization
        if (organization.ownerBy.toString() !== userId) {
            return res.status(403).json({ message: "You do not have permission to remove members from this organization." });
        }

        // Remove the member from the organization's members list
        await User.findByIdAndUpdate(memberId, {
            $pull: { organization: organizationId }
        });

        return res.status(200).json({ message: "Member removed successfully." });
    } catch (error) {
        console.error("Error removing member:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const getOrganizationMembers = async (req, res) => {
    const { organizationId } = req.params;

    try {
        const organization = await Organization.findById(organizationId).populate('members', 'username');
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        const members = await User.find({ organization: organizationId });

        res.status(200).json({ members });
    } catch (error) {
        console.error('Error fetching organization members:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    checkUserOrganization, createOrganization, 
    joinOrganization, getOrganizationsByUser, 
    updateOrganization, deleteOrganization,
    getOrganizationById, inviteMember,
    acceptInvitation, declineInvitation,
    removeMember, getOrganizationMembers
};
