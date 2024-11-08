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

        const noteCount = await Note.countDocuments();
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

exports.updateNote = async (req, res) => {
    const { teamId, noteId } = req.params;
    const { header, description, assignedTo, reviewer, estimatedHours, estimatedCompletionDate, priority, status } = req.body;

    try {
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.header = header;
        note.description = description;
        note.assignedTo = assignedTo;
        note.reviewer = reviewer;
        note.estimatedHours = estimatedHours;
        note.estimatedCompletionDate = estimatedCompletionDate;
        note.priority = priority;
        note.status = status;

        await note.save();

        res.status(200).json({ message: 'Note updated successfully', note });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createPersonalNote = async (req, res) => {
    const { header, description, assignedTo, reviewer, estimatedHours, estimatedCompletionDate, priority, status } = req.body;
    const createdBy = req.userId; // Assuming you have user info in req.user
    console.log(createdBy);
    
    try {
        const createdAt = new Date();
        const estimatedCompletionDate = new Date(createdAt.getTime() + estimatedHours * 60 * 60 * 1000); // Tính toán estimatedCompletionDate
        const noteCount = await Note.countDocuments();
        const ticketId = `THP1-${noteCount + 1}`;
        console.log(ticketId);
        
        const newNote = new Note({
            ticketId,
            header,
            description,
            createdBy: createdBy,
            assignedTo: createdBy || null,
            reviewer: createdBy || null,
            estimatedHours,
            estimatedCompletionDate,
            priority,
            status,
            isPersonal: true // Set isPersonal to true for personal notes
        });

        await newNote.save();

        res.status(201).json({ message: 'Personal note created successfully', note: newNote });
    } catch (error) {
        console.error('Error creating personal note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getPersonalNotes = async (req, res) => {
    const userId = req.userId; // Get userId from the request (after authentication)

    try {
        const notes = await Note.find({ createdBy: userId, isPersonal: true });
        res.status(200).json({ notes });
    } catch (error) {
        console.error('Error fetching personal notes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updatePersonalNote = async (req, res) => {
    const { noteId } = req.params;
    const { header, description, assignedTo, reviewer, estimatedHours, estimatedCompletionDate, priority, status } = req.body;

    try {
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Chỉ cho phép cập nhật note cá nhân
        if (!note.isPersonal) {
            return res.status(400).json({ message: 'Cannot update team note using this endpoint' });
        }

        note.header = header;
        note.description = description;
        note.assignedTo = assignedTo;
        note.reviewer = reviewer;
        note.estimatedHours = estimatedHours;
        note.estimatedCompletionDate = estimatedCompletionDate;
        note.priority = priority;
        note.status = status;

        await note.save();

        res.status(200).json({ message: 'Personal note updated successfully', note });
    } catch (error) {
        console.error('Error updating personal note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getNoteDetails = async (req, res) => {
    const noteId = req.params.noteId;

    try {
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: "Note not found." });
        }
        return res.status(200).json(note);
    } catch (error) {
        console.error("Error fetching note details:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};