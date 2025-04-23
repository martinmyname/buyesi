const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: [true, 'Description is required'],
		},
		image: {
			type: String,
			required: [true, 'Event image is required'],
		},
		startDate: {
			type: Date,
			required: [true, 'Start date is required'],
		},
		endDate: {
			type: Date,
			required: [true, 'End date is required'],
		},
		location: {
			type: String,
			required: [true, 'Location is required'],
		},
		address: {
			type: String,
			default: '',
		},
		organizer: {
			type: String,
			default: 'Buyesi Youth Initiative',
		},
		status: {
			type: String,
			enum: ['upcoming', 'ongoing', 'completed', 'canceled'],
			default: 'upcoming',
		},
		featured: {
			type: Boolean,
			default: false,
		},
		registrationRequired: {
			type: Boolean,
			default: false,
		},
		maximumAttendees: {
			type: Number,
			default: 0,
		},
		attendees: [
			{
				name: {
					type: String,
					required: true,
				},
				email: {
					type: String,
					required: true,
				},
				phone: {
					type: String,
					default: '',
				},
				registrationDate: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

// Generate a URL-friendly slug from the title
eventSchema.pre('validate', function (next) {
	if (this.title && !this.slug) {
		this.slug = this.title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');

		// Add a timestamp to ensure uniqueness
		this.slug = `${this.slug}-${Date.now().toString().slice(-4)}`;
	}

	next();
});

// Virtual for registration status
eventSchema.virtual('isRegistrationOpen').get(function () {
	if (!this.registrationRequired) return false;
	if (this.status !== 'upcoming') return false;
	if (
		this.maximumAttendees > 0 &&
		this.attendees.length >= this.maximumAttendees
	)
		return false;

	return true;
});

// Enable virtuals in JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
