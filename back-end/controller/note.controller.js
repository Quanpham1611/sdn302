const Note = require('../model/note');
const Team = require('../model/team');
const User = require('../model/user');

exports.createNote = async (req, res) => {
    const { teamId } = req.params;
    const { description, assignedTo, estimatedHours, priority, header, status, reviewer } = req.body;
    const createdBy = req.body.createdBy || req.userId; // Assuming you have userId in req
    const createdAt = new Date();

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const noteCount = await Note.countDocuments({ team: teamId });
        const ticketId = `THP1-${noteCount + 1}`;

        const estimatedCompletionDate = new Date(createdAt.getTime() + estimatedHours * 60 * 60 * 1000);

        const newNote = new Note({
            ticketId,
            header,
            description,
            createdBy,
            assignedTo,
            reviewer: status === 'Review' ? reviewer : null,
            createdAt,
            estimatedHours,
            estimatedCompletionDate,
            priority,
            status,
            team: teamId
        });

        await newNote.save();

        res.status(201).json({ message: 'Note created successfully', note: newNote });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getNotes = async (req, res) => {
    const { teamId } = req.params;

    try {
        const notes = await Note.find({ team: teamId }).populate('createdBy', 'username').populate('assignedTo', 'username').populate('reviewer', 'username');
        res.status(200).json({ notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};