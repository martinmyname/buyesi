const express = require('express');
const router = express.Router();
const {
	submitVolunteerApplication,
	getVolunteers,
	getVolunteer,
	updateVolunteer,
	deleteVolunteer,
} = require('../controllers/volunteer.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/', upload.single('resume'), submitVolunteerApplication);

// Protected routes (admin only)
router.get('/', protect, authorize('admin'), getVolunteers);
router.get('/:id', protect, authorize('admin'), getVolunteer);
router.put('/:id', protect, authorize('admin'), updateVolunteer);
router.delete('/:id', protect, authorize('admin'), deleteVolunteer);

module.exports = router;
