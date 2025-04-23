const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
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
		subject: {
			type: String,
			required: [true, 'Subject is required'],
			trim: true,
		},
		message: {
			type: String,
			required: [true, 'Message is required'],
		},
		phone: {
			type: String,
			default: '',
		},
		status: {
			type: String,
			enum: ['new', 'read', 'responded', 'archived'],
			default: 'new',
		},
		ipAddress: {
			type: String,
		},
		response: {
			content: String,
			date: Date,
			responder: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Contact', contactSchema);
