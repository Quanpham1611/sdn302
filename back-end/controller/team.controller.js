// team.controller.js
const Team = require('../model/team');
const User = require('../model/user');
const Organization = require('../model/organiztion');

exports.createTeam = async (req, res) => {
    const { organizationId, name, ownerBy, createdBy } = req.body;

    try {
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        const newTeam = new Team({
            name,
            organization: organizationId,
            ownerBy,
            createdBy,
            members: [createdBy] // Thêm người tạo vào danh sách thành viên
        });

        await newTeam.save();

        // Add the new team to the organization's teams array
        organization.teams.push(newTeam._id);
        await organization.save();

        // Add the new team to the owner's teams array
        const owner = await User.findById(ownerBy);
        owner.teams.push(newTeam._id);
        await owner.save();

        // Add the new team to the creator's teams array
        const creator = await User.findById(createdBy);
        creator.teams.push(newTeam._id);
        await creator.save();

        res.status(201).json({ message: 'Team created successfully', team: newTeam });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.editTeam = async (req, res) => {
    const { teamId } = req.params;
    const { name } = req.body;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        team.name = name;
        await team.save();

        res.status(200).json({ message: 'Team updated successfully', team });
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteTeam = async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        await Team.findByIdAndDelete(teamId);

        // Remove the team from the organization's teams array
        await Organization.updateOne(
            { _id: team.organization },
            { $pull: { teams: teamId } }
        );

        // Remove the team from the users' teams array
        await User.updateMany(
            { teams: teamId },
            { $pull: { teams: teamId } }
        );

        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getTeamDetails = async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await Team.findById(teamId).populate('members', 'username').populate('ownerBy', 'username');
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.status(200).json({ team });
    } catch (error) {
        console.error('Error fetching team details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.addMember = async (req, res) => {
    const { teamId } = req.params;
    const { username } = req.body;

    try {
        const team = await Team.findById(teamId).populate('organization');
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const user = await User.findOne({ username }).populate('organization');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is in the same organization
        if (!user.organization.some(org => org.equals(team.organization._id))) {
            return res.status(400).json({ message: 'User is not in the same organization' });
        }

        // Check if the user is already a member of the team
        if (team.members.some(member => member.equals(user._id))) {
            return res.status(400).json({ message: 'User is already a member of the team' });
        }

        // Add the user to the team's members array
        team.members.push(user._id);
        await team.save();

        // Add the team to the user's teams array
        user.teams.push(teamId);
        await user.save();

        res.status(200).json({ message: 'Member added successfully', team });
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};