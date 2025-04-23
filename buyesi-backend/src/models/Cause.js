const mongoose = require('mongoose');

const causeSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'Description is required'],
		},
		image: {
			type: String,
			required: [true, 'Image is required'],
		},
		targetAmount: {
			type: Number,
			default: 0,
		},
		raisedAmount: {
			type: Number,
			default: 0,
		},
		startDate: {
			type: Date,
			default: Date.now,
		},
		endDate: {
			type: Date,
		},
		status: {
			type: String,
			enum: ['active', 'completed', 'upcoming'],
			default: 'active',
		},
		featured: {
			type: Boolean,
			default: false,
		},
		donations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Donation',
			},
		],
		lastDonationDate: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

// Virtual for progress percentage
causeSchema.virtual('progressPercentage').get(function () {
	if (this.targetAmount === 0) return 0;
	return Math.min(
		Math.round((this.raisedAmount / this.targetAmount) * 100),
		100
	);
});

// Virtual for time since last donation
causeSchema.virtual('timeSinceLastDonation').get(function () {
	if (!this.lastDonationDate) return 'No donations yet';

	const now = new Date();
	const diffTime = Math.abs(now - this.lastDonationDate);
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Yesterday';
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
	if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
	return `${Math.floor(diffDays / 365)} years ago`;
});

// Enable virtuals in JSON
causeSchema.set('toJSON', { virtuals: true });
causeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cause', causeSchema);
