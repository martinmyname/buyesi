const express = require('express');
const router = express.Router();
const {
	getCauses,
	getCause,
	createCause,
	updateCause,
	deleteCause,
	uploadCauseImage,
} = require('../controllers/cause.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getCauses);
router.get('/:id', getCause);

// Protected routes (admin only)
router.post(
	'/',
	protect,
	authorize('admin'),
	upload.single('image'),
	createCause
);
router.put('/:id', protect, authorize('admin'), updateCause);
router.delete('/:id', protect, authorize('admin'), deleteCause);
router.put(
	'/:id/image',
	protect,
	authorize('admin'),
	upload.single('image'),
	uploadCauseImage
);

module.exports = router;
