const User = require("../model/user");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('username');
        return res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const getUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId).select('username');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = {
    getAllUsers, getUserById
};