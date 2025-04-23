const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const teamController = require('../controllers/team.controller');
const { protect, authorize } = require('../middleware/auth');

// Define routes
// GET /api/teams - Get all team members
router.get('/', teamController.getAll);

// GET /api/teams/:id - Get team member by ID
router.get('/:id', teamController.getById);

// POST /api/teams - Create team member (admin only)
router.post(
	'/',
	protect,
	authorize('admin'),
	upload.single('image'),
	teamController.create
);

// PUT /api/teams/:id - Update team member (admin only)
router.put(
	'/:id',
	protect,
	authorize('admin'),
	upload.single('image'),
	teamController.update
);

// DELETE /api/teams/:id - Delete team member (admin only)
router.delete('/:id', protect, authorize('admin'), teamController.delete);

module.exports = router;
