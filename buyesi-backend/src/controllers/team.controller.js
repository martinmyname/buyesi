const Team = require('../models/Team');
const path = require('path');
const fs = require('fs');

// Get all team members
exports.getAll = async (req, res) => {
	try {
		const team = await Team.find().sort({ order: 1 });
		res.status(200).json(team);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get team member by ID
exports.getById = async (req, res) => {
	try {
		const teamMember = await Team.findById(req.params.id);
		if (!teamMember) {
			return res.status(404).json({ message: 'Team member not found' });
		}
		res.status(200).json(teamMember);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create team member
exports.create = async (req, res) => {
	try {
		const { name, position, description, email, phone, socialMedia } = req.body;

		// Handle image upload
		let imagePath = '';
		if (req.file) {
			imagePath = `/uploads/team/${req.file.filename}`;
		}

		const teamMember = new Team({
			name,
			position,
			bio: description,
			image: imagePath,
			email,
			phone,
			socialMedia: socialMedia ? JSON.parse(socialMedia) : {},
		});

		await teamMember.save();
		res.status(201).json({
			success: true,
			data: teamMember,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Update team member
exports.update = async (req, res) => {
	try {
		const { name, position, description, email, phone, socialMedia } = req.body;
		const teamMember = await Team.findById(req.params.id);

		if (!teamMember) {
			return res.status(404).json({ message: 'Team member not found' });
		}

		// Handle image upload
		if (req.file) {
			// Delete old image if exists
			if (teamMember.image) {
				const oldImagePath = path.join(__dirname, '..', teamMember.image);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}
			teamMember.image = `/uploads/team/${req.file.filename}`;
		}

		teamMember.name = name || teamMember.name;
		teamMember.position = position || teamMember.position;
		teamMember.bio = description || teamMember.bio;
		teamMember.email = email || teamMember.email;
		teamMember.phone = phone || teamMember.phone;
		teamMember.socialMedia = socialMedia
			? JSON.parse(socialMedia)
			: teamMember.socialMedia;

		await teamMember.save();
		res.status(200).json(teamMember);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete team member
exports.delete = async (req, res) => {
	try {
		const teamMember = await Team.findById(req.params.id);

		if (!teamMember) {
			return res.status(404).json({ message: 'Team member not found' });
		}

		// Delete image if exists
		if (teamMember.image) {
			const imagePath = path.join(__dirname, '..', teamMember.image);
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
		}

		await Team.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: 'Team member deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
