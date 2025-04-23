const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			trim: true,
		},
		description: {
			type: String,
			default: '',
		},
		image: {
			type: String,
			required: [true, 'Image is required'],
		},
		category: {
			type: String,
			default: 'general',
		},
		tags: [String],
		featured: {
			type: Boolean,
			default: false,
		},
		order: {
			type: Number,
			default: 0,
		},
		relatedCause: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Cause',
		},
		relatedEvent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Gallery', gallerySchema);
