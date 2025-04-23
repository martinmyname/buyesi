const Volunteer = require('../models/Volunteer');

// @desc    Submit volunteer application
// @route   POST /api/volunteers
// @access  Public
exports.submitVolunteerApplication = async (req, res) => {
	try {
		const { name, email, message } = req.body;

		// Validate required fields
		if (!name || !email || !message) {
			return res.status(400).json({
				success: false,
				message: 'Please provide name, email and message',
			});
		}

		// Create volunteer application with basic required fields
		const volunteer = await Volunteer.create({
			name,
			email,
			message,
			// File upload handling if present
			resume: req.file ? `/uploads/${req.file.filename}` : undefined,
		});

		res.status(201).json({
			success: true,
			message:
				'Your volunteer application has been submitted successfully. We will contact you soon.',
			data: volunteer,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Get all volunteer applications
// @route   GET /api/volunteers
// @access  Private/Admin
exports.getVolunteers = async (req, res) => {
	try {
		const volunteers = await Volunteer.find().sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			count: volunteers.length,
			data: volunteers,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Get single volunteer application
// @route   GET /api/volunteers/:id
// @access  Private/Admin
exports.getVolunteer = async (req, res) => {
	try {
		const volunteer = await Volunteer.findById(req.params.id);

		if (!volunteer) {
			return res.status(404).json({
				success: false,
				message: 'Volunteer application not found',
			});
		}

		res.status(200).json({
			success: true,
			data: volunteer,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Update volunteer status
// @route   PUT /api/volunteers/:id
// @access  Private/Admin
exports.updateVolunteer = async (req, res) => {
	try {
		let volunteer = await Volunteer.findById(req.params.id);

		if (!volunteer) {
			return res.status(404).json({
				success: false,
				message: 'Volunteer application not found',
			});
		}

		// Update volunteer
		volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			data: volunteer,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Delete volunteer application
// @route   DELETE /api/volunteers/:id
// @access  Private/Admin
exports.deleteVolunteer = async (req, res) => {
	try {
		const volunteer = await Volunteer.findById(req.params.id);

		if (!volunteer) {
			return res.status(404).json({
				success: false,
				message: 'Volunteer application not found',
			});
		}

		await volunteer.deleteOne();

		res.status(200).json({
			success: true,
			message: 'Volunteer application deleted successfully',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
