const Cause = require('../models/Cause');

// @desc    Get all causes
// @route   GET /api/causes
// @access  Public
exports.getCauses = async (req, res) => {
	try {
		// Query parameters
		const { featured, status, limit = 10, page = 1 } = req.query;

		// Build query
		const query = {};

		// Filter by featured
		if (featured === 'true') {
			query.featured = true;
		}

		// Filter by status
		if (status) {
			query.status = status;
		}

		// Pagination
		const skip = (parseInt(page) - 1) * parseInt(limit);

		// Execute query
		const causes = await Cause.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		// Get total count
		const total = await Cause.countDocuments(query);

		res.status(200).json({
			success: true,
			count: causes.length,
			total,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				pages: Math.ceil(total / parseInt(limit)),
			},
			data: causes,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Get single cause
// @route   GET /api/causes/:id
// @access  Public
exports.getCause = async (req, res) => {
	try {
		const cause = await Cause.findById(req.params.id).populate(
			'donations',
			'amount name anonymous createdAt'
		);

		if (!cause) {
			return res.status(404).json({
				success: false,
				message: 'Cause not found',
			});
		}

		res.status(200).json({
			success: true,
			data: cause,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Create new cause
// @route   POST /api/causes
// @access  Private/Admin
exports.createCause = async (req, res) => {
	try {
		console.log('Create cause request body:', req.body);
		console.log('Create cause request file:', req.file);

		const { title, description, targetAmount, categories, tags, raisedAmount } =
			req.body;

		// Handle image upload
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: 'Please upload an image',
			});
		}

		// Parse categories and tags if they exist
		let categoriesArray = [];
		let tagsArray = [];

		try {
			if (categories) categoriesArray = JSON.parse(categories);
			if (tags) tagsArray = JSON.parse(tags);
		} catch (e) {
			console.error('Error parsing categories or tags:', e);
		}

		// Create cause
		const cause = await Cause.create({
			title,
			description,
			targetAmount: parseFloat(targetAmount),
			raisedAmount: parseFloat(raisedAmount || 0),
			image: req.file.filename,
			categories: categoriesArray,
			tags: tagsArray,
		});

		res.status(201).json({
			success: true,
			data: cause,
		});
	} catch (error) {
		console.error('Error creating cause:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Update cause
// @route   PUT /api/causes/:id
// @access  Private/Admin
exports.updateCause = async (req, res) => {
	try {
		let cause = await Cause.findById(req.params.id);

		if (!cause) {
			return res.status(404).json({
				success: false,
				message: 'Cause not found',
			});
		}

		// Update cause
		cause = await Cause.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			data: cause,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Delete cause
// @route   DELETE /api/causes/:id
// @access  Private/Admin
exports.deleteCause = async (req, res) => {
	try {
		const cause = await Cause.findById(req.params.id);

		if (!cause) {
			return res.status(404).json({
				success: false,
				message: 'Cause not found',
			});
		}

		await cause.deleteOne();

		res.status(200).json({
			success: true,
			message: 'Cause deleted successfully',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Upload cause image
// @route   PUT /api/causes/:id/image
// @access  Private/Admin
exports.uploadCauseImage = async (req, res) => {
	try {
		const cause = await Cause.findById(req.params.id);

		if (!cause) {
			return res.status(404).json({
				success: false,
				message: 'Cause not found',
			});
		}

		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: 'Please upload a file',
			});
		}

		// Update cause with new image path
		cause.image = req.file.filename;
		await cause.save();

		res.status(200).json({
			success: true,
			data: cause,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
