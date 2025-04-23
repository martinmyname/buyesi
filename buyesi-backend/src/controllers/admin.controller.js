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
		const teamMember = await Team.create({
			...req.body,
			image: req.file ? req.file.filename : undefined,
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
		const teamMember = await Team.findByIdAndUpdate(
			req.params.id,
			{
				...req.body,
				image: req.file ? req.file.filename : undefined,
			},
			{ new: true }
		);
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
		const blogPost = await Blog.create({
			...req.body,
			image: req.file ? req.file.filename : undefined,
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
		const blogPost = await Blog.findByIdAndUpdate(
			req.params.id,
			{
				...req.body,
				image: req.file ? req.file.filename : undefined,
			},
			{ new: true }
		);
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
		const event = await Event.create({
			...req.body,
			image: req.file ? req.file.filename : undefined,
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
		const event = await Event.findByIdAndUpdate(
			req.params.id,
			{
				...req.body,
				image: req.file ? req.file.filename : undefined,
			},
			{ new: true }
		);
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
		const galleryImage = await Gallery.create({
			...req.body,
			image: req.file ? req.file.filename : undefined,
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
		const cause = await Cause.create({
			...req.body,
			image: req.file ? req.file.filename : undefined,
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
		const cause = await Cause.findByIdAndUpdate(
			req.params.id,
			{
				...req.body,
				image: req.file ? req.file.filename : undefined,
			},
			{ new: true }
		);
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
