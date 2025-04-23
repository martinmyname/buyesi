const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
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
		content: {
			type: String,
			required: [true, 'Content is required'],
		},
		excerpt: {
			type: String,
			required: [true, 'Excerpt is required'],
		},
		image: {
			type: String,
			required: [true, 'Featured image is required'],
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		categories: [
			{
				type: String,
				trim: true,
			},
		],
		tags: [
			{
				type: String,
				trim: true,
			},
		],
		status: {
			type: String,
			enum: ['draft', 'published'],
			default: 'draft',
		},
		featured: {
			type: Boolean,
			default: false,
		},
		views: {
			type: Number,
			default: 0,
		},
		comments: [
			{
				user: {
					type: String,
					required: true,
				},
				email: {
					type: String,
					required: true,
				},
				comment: {
					type: String,
					required: true,
				},
				date: {
					type: Date,
					default: Date.now,
				},
				approved: {
					type: Boolean,
					default: false,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

// Generate a URL-friendly slug from the title
blogSchema.pre('validate', function (next) {
	console.log(`Pre-validate hook: Title='${this.title}', Slug='${this.slug}'`);
	if (this.title && !this.slug) {
		this.slug = this.title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');

		// Add a timestamp to ensure uniqueness
		this.slug = `${this.slug}-${Date.now().toString().slice(-4)}`;
		console.log(`Pre-validate hook: Generated Slug='${this.slug}'`);
	}

	next();
});

module.exports = mongoose.model('Blog', blogSchema);
