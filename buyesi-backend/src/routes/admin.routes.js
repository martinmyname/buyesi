const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
	addTeamMember,
	updateTeamMember,
	deleteTeamMember,
	addBlogPost,
	updateBlogPost,
	deleteBlogPost,
	addEvent,
	updateEvent,
	deleteEvent,
	addGalleryImage,
	deleteGalleryImage,
	addCause,
	updateCause,
	deleteCause,
	getDonations,
	getDonation,
	getVolunteers,
	getVolunteer
} = require('../controllers/admin.controller');

// Admin dashboard routes
router.get('/dashboard', protect, authorize('admin'), (req, res) => {
	res.status(200).json({ message: 'Admin dashboard - to be implemented' });
});

// Team management
router.post('/team', protect, authorize('admin'), upload.single('image'), addTeamMember);
router.put('/team/:id', protect, authorize('admin'), upload.single('image'), updateTeamMember);
router.delete('/team/:id', protect, authorize('admin'), deleteTeamMember);

// Blog management
router.post('/blog', protect, authorize('admin'), upload.single('image'), addBlogPost);
router.put('/blog/:id', protect, authorize('admin'), upload.single('image'), updateBlogPost);
router.delete('/blog/:id', protect, authorize('admin'), deleteBlogPost);

// Event management
router.post('/events', protect, authorize('admin'), upload.single('image'), addEvent);
router.put('/events/:id', protect, authorize('admin'), upload.single('image'), updateEvent);
router.delete('/events/:id', protect, authorize('admin'), deleteEvent);

// Gallery management
router.post('/gallery', protect, authorize('admin'), upload.single('image'), addGalleryImage);
router.delete('/gallery/:id', protect, authorize('admin'), deleteGalleryImage);

// Cause management
router.post('/causes', protect, authorize('admin'), upload.single('image'), addCause);
router.put('/causes/:id', protect, authorize('admin'), upload.single('image'), updateCause);
router.delete('/causes/:id', protect, authorize('admin'), deleteCause);

// Donation management
router.get('/donations', protect, authorize('admin'), getDonations);
router.get('/donations/:id', protect, authorize('admin'), getDonation);

// Volunteer management
router.get('/volunteers', protect, authorize('admin'), getVolunteers);
router.get('/volunteers/:id', protect, authorize('admin'), getVolunteer);

module.exports = router;
