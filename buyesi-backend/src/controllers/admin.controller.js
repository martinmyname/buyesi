const Team = require('../models/Team');
const Blog = require('../models/Blog');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const Cause = require('../models/Cause');
const Donation = require('../models/Donation');
const Volunteer = require('../models/Volunteer');

// Team Management
exports.addTeamMember = async (req, res) => {
	try {
		// Get image data from either the uploaded file or the request body
		let imageData = null;

		if (req.file && req.file.cloudinary) {
			// If a file was uploaded and processed by cloudinary
			imageData = {
				url: req.file.cloudinary.url,
				public_id: req.file.cloudinary.public_id,
				signature: req.file.cloudinary.signature,
			};
		} else if (req.body.image) {
			// If an image URL was provided in the body
			imageData = {
				url: req.body.image,
			};
		}

		if (!imageData) {
			return res.status(400).json({
				success: false,
				error: 'Team member image is required',
			});
		}

		const teamMember = await Team.create({
			...req.body,
			image: imageData.url,
			imageData: imageData, // Store full metadata
		});

		res.status(201).json({
			success: true,
			data: teamMember,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

exports.updateTeamMember = async (req, res) => {
	try {
		let updateData = { ...req.body };

		// Process image data if provided
		if (req.file && req.file.cloudinary) {
			updateData.image = req.file.cloudinary.url;
			updateData.imageData = {
				url: req.file.cloudinary.url,
				public_id: req.file.cloudinary.public_id,
				signature: req.file.cloudinary.signature,
			};
		} else if (req.body.image && !updateData.imageData) {
			updateData.imageData = {
				url: req.body.image,
			};
		}

		const teamMember = await Team.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
		});

		res.status(200).json({
			success: true,
			data: teamMember,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

exports.deleteTeamMember = async (req, res) => {
	try {
		await Team.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

// Blog Management
exports.addBlogPost = async (req, res) => {
	try {
		// Get image data from either the uploaded file or the request body
		let imageData = null;

		if (req.file && req.file.cloudinary) {
			// If a file was uploaded and processed by cloudinary, use the cloudinary data
			imageData = {
				url: req.file.cloudinary.url,
				public_id: req.file.cloudinary.public_id,
				signature: req.file.cloudinary.signature,
			};
		} else if (req.body.image) {
			// If an image URL was provided in the body, use that
			imageData = {
				url: req.body.image,
			};
		}

		if (!imageData) {
			return res.status(400).json({
				success: false,
				error: 'Featured image is required',
			});
		}

		// Create the blog post with image data
		const blogPost = await Blog.create({
			...req.body,
			image: imageData.url,
			imageData: imageData, // Store full metadata
		});

		res.status(201).json({
			success: true,
			data: blogPost,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

exports.updateBlogPost = async (req, res) => {
	try {
		let updateData = { ...req.body };

		// Get image data from either the uploaded file or the request body
		if (req.file && req.file.cloudinary) {
			// If a file was uploaded and processed by cloudinary, use the cloudinary data
			updateData.image = req.file.cloudinary.url;
			updateData.imageData = {
				url: req.file.cloudinary.url,
				public_id: req.file.cloudinary.public_id,
				signature: req.file.cloudinary.signature,
			};
		} else if (req.body.image) {
			// If an image URL was provided directly, keep it
			// No change needed for the main image field

			// But we can still try to update imageData if we don't have it already
			if (!updateData.imageData) {
				updateData.imageData = {
					url: req.body.image,
				};
			}
		}

		const blogPost = await Blog.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
		});

		res.status(200).json({
			success: true,
			data: blogPost,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

exports.deleteBlogPost = async (req, res) => {
	try {
		await Blog.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

// Event Management
exports.addEvent = async (req, res) => {
	try {
		// Get image data from either the uploaded file or the request body
		let imageData = null;

		if (req.file && req.file.cloudinary) {
			// If a file was uploaded and processed by cloudinary
			imageData = {
				url: req.file.cloudinary.url,
				public_id: req.file.cloudinary.public_id,
				signature: req.file.cloudinary.signature,
			};
		} else if (req.body.image) {
			// If an image URL was provided in the body
			imageData = {
				url: req.body.image,
			};
		}

		if (!imageData) {
			return res.status(400).json({
				success: false,
				error: 'Event image is required',
			});
		}

		const event = await Event.create({
			...req.body,
			image: imageData.url,
			imageData: imageData, // Store full metadata
		});

		res.status(201).json({
			success: true,
			data: event,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

exports.updateEvent = async (req, res) => {
	try {
		let updateData = { ...req.body };

		// Process image data if provided
		if (req.file && req.file.cloudinary) {
			updateData.image = req.file.cloudinary.url;
			updateData.imageData = {
				url: req.file.cloudinary.url,
				public_id: req.file.cloudinary.public_id,
				signature: req.file.cloudinary.signature,
			};
		} else if (req.body.image && !updateData.imageData) {
			updateData.imageData = {
				url: req.body.image,
			};
		}

		const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
		});

		res.status(200).json({
			success: true,
			data: event,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

exports.deleteEvent = async (req, res) => {
	try {
		await Event.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

// Gallery Management
exports.addGalleryImage = async (req, res) => {
	try {
		// Get image data from either the uploaded file or the request body
		let imageData = null;

		if (req.file && req.file.cloudinary) {
			// If a file was uploaded and processed by cloudinary
			imageData = {
				url: req.file.cloudinary.url,
				public_id: req.file.cloudinary.public_id,
				signature: req.file.cloudinary.signature,
			};
		} else if (req.body.image) {
			// If an image URL was provided in the body
			imageData = {
				url: req.body.image,
			};
		}

		if (!imageData) {
			return res.status(400).json({
				success: false,
				error: 'Gallery image is required',
			});
		}

		const galleryImage = await Gallery.create({
			...req.body,
			image: imageData.url,
			imageData: imageData, // Store full metadata
		});

		res.status(201).json({
			success: true,
			data: galleryImage,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

exports.deleteGalleryImage = async (req, res) => {
	try {
		await Gallery.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

// Cause Management
exports.addCause = async (req, res) => {
	try {
		// Get image data from either the uploaded file or the request body
		let imageData = null;

		if (req.file && req.file.cloudinary) {
			// If a file was uploaded and processed by cloudinary
			imageData = {
				url: req.file.cloudinary.url,
				public_id: req.file.cloudinary.public_id,
				signature: req.file.cloudinary.signature,
			};
		} else if (req.body.image) {
			// If an image URL was provided in the body
			imageData = {
				url: req.body.image,
			};
		}

		if (!imageData) {
			return res.status(400).json({
				success: false,
				error: 'Cause image is required',
			});
		}

		const cause = await Cause.create({
			...req.body,
			image: imageData.url,
			imageData: imageData, // Store full metadata
		});

		res.status(201).json({
			success: true,
			data: cause,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

exports.updateCause = async (req, res) => {
	try {
		let updateData = { ...req.body };

		// Process image data if provided
		if (req.file && req.file.cloudinary) {
			updateData.image = req.file.cloudinary.url;
			updateData.imageData = {
				url: req.file.cloudinary.url,
				public_id: req.file.cloudinary.public_id,
				signature: req.file.cloudinary.signature,
			};
		} else if (req.body.image && !updateData.imageData) {
			updateData.imageData = {
				url: req.body.image,
			};
		}

		const cause = await Cause.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
		});

		res.status(200).json({
			success: true,
			data: cause,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

exports.deleteCause = async (req, res) => {
	try {
		await Cause.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

// Donation Management
exports.getDonations = async (req, res) => {
	try {
		const donations = await Donation.find().populate('user');
		res.status(200).json({
			success: true,
			count: donations.length,
			data: donations,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

exports.getDonation = async (req, res) => {
	try {
		const donation = await Donation.findById(req.params.id).populate('user');
		res.status(200).json({
			success: true,
			data: donation,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

// Volunteer Management
exports.getVolunteers = async (req, res) => {
	try {
		const volunteers = await Volunteer.find();
		res.status(200).json({
			success: true,
			count: volunteers.length,
			data: volunteers,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

exports.getVolunteer = async (req, res) => {
	try {
		const volunteer = await Volunteer.findById(req.params.id);
		res.status(200).json({
			success: true,
			data: volunteer,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};
