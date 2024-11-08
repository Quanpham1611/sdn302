const express = require('express');
const router = express.Router();
const noteController = require('../controller/note.controller');
const { verifyToken } = require('../middleware/auth');

// Create a new note
router.post('/:teamId/notes', noteController.createNote);

// Get notes for a team
router.get('/:teamId/notes', noteController.getNotes);

router.put('/:teamId/notes/:noteId', noteController.updateNote);

router.get('/personal', verifyToken, noteController.getPersonalNotes);
router.post('/personal', verifyToken, noteController.createPersonalNote);
router.put('/personal/:noteId', verifyToken, noteController.updatePersonalNote); // Thêm route cho cập nhật note cá nhân
router.get('/:noteId', verifyToken, noteController.getNoteDetails); // Route for note details

module.exports = router;