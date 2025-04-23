const express = require('express');
const router = express.Router();
const {
	submitContactForm,
	getContacts,
	getContact,
	updateContact,
	deleteContact,
} = require('../controllers/contact.controller');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/', submitContactForm);

// Protected routes (admin only)
router.get('/', protect, authorize('admin'), getContacts);
router.get('/:id', protect, authorize('admin'), getContact);
router.put('/:id', protect, authorize('admin'), updateContact);
router.delete('/:id', protect, authorize('admin'), deleteContact);

module.exports = router;
