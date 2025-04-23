const Blog = require('../models/Blog');
const path = require('path');
const fs = require('fs');

// Get all blog posts
exports.getAll = async (req, res) => {
	try {
		const { status, category, tag, featured } = req.query;
		const query = {};

		if (status) query.status = status;
		if (category) query.categories = category;
		if (tag) query.tags = tag;
		if (featured) query.featured = featured === 'true';

		const blogs = await Blog.find(query)
			.populate('author', 'name email')
			.sort({ createdAt: -1 });
		res.status(200).json({
			success: true,
			data: blogs,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Get blog post by ID or slug
exports.getById = async (req, res) => {
	try {
		const blog = await Blog.findOne({
			$or: [{ _id: req.params.id }, { slug: req.params.id }],
		}).populate('author', 'name email');

		if (!blog) {
			return res.status(404).json({
				success: false,
				message: 'Blog post not found',
			});
		}

		// Increment views
		blog.views += 1;
		await blog.save();

		res.status(200).json({
			success: true,
			data: blog,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Create blog post
exports.create = async (req, res) => {
	try {
		// Log incoming data
		console.log('Controller req.body:', req.body);
		console.log('Controller req.file:', req.file);
		console.log('Controller req.user:', req.user);
		console.log('Controller req.files:', req.files);
		console.log('Controller headers:', req.headers);

		const { title, content, excerpt, categories, tags, status, featured } =
			req.body;

		// Backend check for image presence
		if (!req.file) {
			console.error('No file received in request');
			return res.status(400).json({
				success: false,
				message: 'Featured image is required by backend.',
			});
		}

		let imagePath = req.file.filename;

		// Handle categories/tags - Assuming frontend sends stringified JSON
		let categoriesArray = [];
		try {
			if (categories) categoriesArray = JSON.parse(categories);
		} catch (e) {
			console.error('Error parsing categories:', e);
		}

		let tagsArray = [];
		try {
			if (tags) tagsArray = JSON.parse(tags);
		} catch (e) {
			console.error('Error parsing tags:', e);
		}

		// Handle 'featured' checkbox (value is 'on' if checked)
		const isFeatured = featured === 'on';

		// Ensure author exists
		if (!req.user || !req.user._id) {
			return res.status(400).json({
				success: false,
				message: 'User authentication not found.',
			});
		}

		const blog = new Blog({
			title,
			content,
			excerpt,
			image: imagePath,
			author: req.user._id,
			categories: categoriesArray,
			tags: tagsArray,
			status: status || 'draft',
			featured: isFeatured,
		});

		console.log('Blog instance before save:', JSON.stringify(blog, null, 2));

		await blog.save();

		res.status(201).json({
			success: true,
			data: blog,
		});
	} catch (error) {
		console.error('Error in blog controller create:', error);
		res.status(500).json({
			success: false,
			message: error.message || 'Internal server error during blog creation.',
			errors: error.errors,
		});
	}
};

// Update blog post
exports.update = async (req, res) => {
	try {
		const { title, content, excerpt, categories, tags, status, featured } =
			req.body;
		const blog = await Blog.findById(req.params.id);

		if (!blog) {
			return res.status(404).json({
				success: false,
				message: 'Blog post not found',
			});
		}

		// Handle image upload
		if (req.file) {
			blog.image = `/uploads/blog/${req.file.filename}`;
		}

		blog.title = title || blog.title;
		blog.content = content || blog.content;
		blog.excerpt = excerpt || blog.excerpt;
		blog.categories = categories ? JSON.parse(categories) : blog.categories;
		blog.tags = tags ? JSON.parse(tags) : blog.tags;
		blog.status = status || blog.status;
		blog.featured = featured === 'true' ? true : blog.featured;

		await blog.save();
		res.status(200).json({
			success: true,
			data: blog,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Delete blog post
exports.delete = async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.id);

		if (!blog) {
			return res.status(404).json({
				success: false,
				message: 'Blog post not found',
			});
		}

		await Blog.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			message: 'Blog post deleted successfully',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Add comment to blog post
exports.addComment = async (req, res) => {
	try {
		const { content } = req.body;
		const blog = await Blog.findById(req.params.id);

		if (!blog) {
			return res.status(404).json({
				success: false,
				message: 'Blog post not found',
			});
		}

		const comment = {
			content,
			author: req.user._id,
		};

		blog.comments.push(comment);
		await blog.save();

		res.status(201).json({
			success: true,
			data: comment,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Delete comment from blog post
exports.deleteComment = async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.id);

		if (!blog) {
			return res.status(404).json({
				success: false,
				message: 'Blog post not found',
			});
		}

		const comment = blog.comments.id(req.params.commentId);
		if (!comment) {
			return res.status(404).json({
				success: false,
				message: 'Comment not found',
			});
		}

		comment.remove();
		await blog.save();

		res.status(200).json({
			success: true,
			message: 'Comment deleted successfully',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Approve comment
exports.approveComment = async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.id);

		if (!blog) {
			return res.status(404).json({
				success: false,
				message: 'Blog post not found',
			});
		}

		const comment = blog.comments.id(req.params.commentId);
		if (!comment) {
			return res.status(404).json({
				success: false,
				message: 'Comment not found',
			});
		}

		comment.approved = true;
		await blog.save();

		res.status(200).json({
			success: true,
			message: 'Comment approved successfully',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
