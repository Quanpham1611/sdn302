// team.router.js
const express = require('express');
const router = express.Router();
const teamController = require('../controller/team.controller');

// Create a new team
router.post('/createTeam', teamController.createTeam);
// Edit a team
router.put('/:teamId', teamController.editTeam);
// Delete a team
router.delete('/:teamId', teamController.deleteTeam);
router.get('/:teamId', teamController.getTeamDetails);
router.post('/:teamId/addMember', teamController.addMember);

module.exports = router;