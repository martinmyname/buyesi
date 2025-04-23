const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			trim: true,
			match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
		},
		message: {
			type: String,
			required: [true, 'Message is required'],
		},
		// Optional fields below - will only be used in admin forms
		phone: {
			type: String,
			default: '',
		},
		address: {
			type: String,
			default: '',
		},
		skills: {
			type: [String],
			default: [],
		},
		availability: {
			type: String,
			default: '',
		},
		experienceLevel: {
			type: String,
			enum: ['beginner', 'intermediate', 'experienced'],
			default: 'beginner',
		},
		interests: {
			type: [String],
			default: [],
		},
		resume: {
			type: String,
		},
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected', 'inactive'],
			default: 'pending',
		},
		assignedProjects: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Cause',
			},
		],
		notes: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Volunteer', volunteerSchema);
