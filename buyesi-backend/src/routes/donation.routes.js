const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
	getAll,
	getById,
	create,
	updateStatus,
	markReceiptSent,
	getStatistics,
} = require('../controllers/donation.controller');

// Define routes
// GET /api/donations - Get all donations (admin only)
router.get('/', protect, authorize('admin'), getAll);

// GET /api/donations/:id - Get donation by ID (admin only)
router.get('/:id', protect, authorize('admin'), getById);

// POST /api/donations - Create donation
router.post('/', create);

// PUT /api/donations/:id/status - Update donation status (admin only)
router.put('/:id/status', protect, authorize('admin'), updateStatus);

// PUT /api/donations/:id/receipt - Mark receipt as sent (admin only)
router.put('/:id/receipt', protect, authorize('admin'), markReceiptSent);

// GET /api/donations/statistics - Get donation statistics (admin only)
router.get('/statistics', protect, authorize('admin'), getStatistics);

module.exports = router;
