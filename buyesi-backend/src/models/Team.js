const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
		},
		position: {
			type: String,
			required: [true, 'Position is required'],
			trim: true,
		},
		image: {
			type: String,
			required: [true, 'Image is required'],
		},
		bio: {
			type: String,
			default: '',
		},
		email: {
			type: String,
			match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
			default: '',
		},
		phone: {
			type: String,
			default: '',
		},
		socialMedia: {
			facebook: {
				type: String,
				default: '',
			},
			twitter: {
				type: String,
				default: '',
			},
			linkedin: {
				type: String,
				default: '',
			},
			instagram: {
				type: String,
				default: '',
			},
		},
		order: {
			type: Number,
			default: 0,
		},
		featured: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Team', teamSchema);
