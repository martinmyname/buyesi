const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const {
	getAll,
	getById,
	create,
	update,
	delete: deleteEvent,
	registerAttendee,
	removeAttendee,
} = require('../controllers/event.controller');

// Define routes
// GET /api/events - Get all events
router.get('/', getAll);

// GET /api/events/:id - Get event by ID
router.get('/:id', getById);

// POST /api/events - Create event (admin only)
router.post('/', protect, authorize('admin'), upload.single('image'), create);

// PUT /api/events/:id - Update event (admin only)
router.put('/:id', protect, authorize('admin'), upload.single('image'), update);

// DELETE /api/events/:id - Delete event (admin only)
router.delete('/:id', protect, authorize('admin'), deleteEvent);

// POST /api/events/:id/register - Register for event
router.post('/:id/register', registerAttendee);

// DELETE /api/events/:id/attendees/:attendeeId - Remove attendee (admin only)
router.delete(
	'/:id/attendees/:attendeeId',
	protect,
	authorize('admin'),
	removeAttendee
);

module.exports = router;
