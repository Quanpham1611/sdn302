const User = require("../model/user");
const Organization = require("../model/organiztion");
const Team = require("../model/team");
const Note = require("../model/note");
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

const getUserInfo = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId).populate({
            path: 'organization',
            populate: {
                path: 'teams',
                model: 'Team',
                select: 'name' // Chỉ populate trường name của Team
            },
            select: 'name' // Chỉ populate trường name của Organization
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const search = async (req, res) => {
    const query = req.query.q;

    try {
        const users = await User.find({ username: { $regex: query, $options: 'i' } }).select('username');
        const organizations = await Organization.find({ name: { $regex: query, $options: 'i' } }).select('name');
        const teams = await Team.find({ name: { $regex: query, $options: 'i' } }).select('name');
        const notes = await Note.find({
            $or: [
                { ticketId: { $regex: query, $options: 'i' } },
                { header: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).select('ticketId header description');

        res.status(200).json({ users, organizations, teams, notes });
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    getAllUsers, getUserById, getUserInfo, search
};