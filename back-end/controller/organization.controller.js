const Organization = require("../model/organiztion");
const User = require("../model/user");

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


module.exports = {
    checkUserOrganization, createOrganization, joinOrganization, getOrganizationsByUser
};
