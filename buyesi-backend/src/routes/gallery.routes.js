const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const {
	getAll,
	getById,
	create,
	update,
	delete: deleteGallery,
	updateOrder,
} = require('../controllers/gallery.controller');

// Define routes
// GET /api/galleries - Get all gallery images
router.get('/', getAll);

// GET /api/galleries/:id - Get gallery image by ID
router.get('/:id', getById);

// POST /api/galleries - Add gallery image (admin only)
router.post('/', protect, authorize('admin'), upload.single('image'), create);

// PUT /api/galleries/:id - Update gallery image (admin only)
router.put('/:id', protect, authorize('admin'), upload.single('image'), update);

// DELETE /api/galleries/:id - Delete gallery image (admin only)
router.delete('/:id', protect, authorize('admin'), deleteGallery);

// PUT /api/galleries/order - Update gallery order (admin only)
router.put('/order', protect, authorize('admin'), updateOrder);

module.exports = router;
