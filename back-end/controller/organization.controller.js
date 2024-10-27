const Organization = require("../model/organiztion");
const User = require("../model/user");

// Check if user is in any organization
const checkUserOrganization = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find organizations that include the user
        const organization = await Organization.findOne({ members: userId }).populate("members");

        if (!organization) {
            // If no organization found
            return res.status(200).json({
                message: "User is not in any organization",
            });
        }

        // If organization found
        return res.status(200).json({
            message: "User is in an organization",
            organization,
        });
    } catch (error) {
        console.error("Error checking organization:", error);
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



module.exports = {
    checkUserOrganization, createOrganization, joinOrganization
};
