const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const {
	getAll,
	getById,
	create,
	update,
	delete: deleteBlog,
	addComment,
	approveComment,
	deleteComment,
} = require('../controllers/blog.controller');

// Define routes
// GET /api/blogs - Get all blog posts
router.get('/', getAll);

// GET /api/blogs/:id - Get blog post by ID
router.get('/:id', getById);

// POST /api/blogs - Create blog post (admin only)
router.post('/', protect, authorize('admin'), upload.single('image'), create);

// PUT /api/blogs/:id - Update blog post (admin only)
router.put('/:id', protect, authorize('admin'), upload.single('image'), update);

// DELETE /api/blogs/:id - Delete blog post (admin only)
router.delete('/:id', protect, authorize('admin'), deleteBlog);

// POST /api/blogs/:id/comments - Add comment to blog post
router.post('/:id/comments', addComment);

// PUT /api/blogs/:id/comments/:commentId/approve - Approve comment (admin only)
router.put(
	'/:id/comments/:commentId/approve',
	protect,
	authorize('admin'),
	approveComment
);

// DELETE /api/blogs/:id/comments/:commentId - Delete comment (admin only)
router.delete(
	'/:id/comments/:commentId',
	protect,
	authorize('admin'),
	deleteComment
);

module.exports = router;
