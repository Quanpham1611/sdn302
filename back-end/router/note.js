const express = require('express');
const router = express.Router();
const noteController = require('../controller/note.controller');

// Create a new note
router.post('/:teamId/notes', noteController.createNote);

// Get notes for a team
router.get('/:teamId/notes', noteController.getNotes);

module.exports = router;