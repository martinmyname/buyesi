const Gallery = require('../models/Gallery');
const path = require('path');
const fs = require('fs');

// Get all gallery items
exports.getAll = async (req, res) => {
	try {
		const { category, featured, relatedCause, relatedEvent } = req.query;
		const query = {};

		if (category) query.category = category;
		if (featured) query.featured = featured === 'true';
		if (relatedCause) query.relatedCause = relatedCause;
		if (relatedEvent) query.relatedEvent = relatedEvent;

		const gallery = await Gallery.find(query)
			.populate('relatedCause', 'title')
			.populate('relatedEvent', 'title')
			.sort({ order: 1, createdAt: -1 });
		res.status(200).json(gallery);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get gallery item by ID
exports.getById = async (req, res) => {
	try {
		const galleryItem = await Gallery.findById(req.params.id)
			.populate('relatedCause', 'title')
			.populate('relatedEvent', 'title');

		if (!galleryItem) {
			return res.status(404).json({ message: 'Gallery item not found' });
		}

		res.status(200).json(galleryItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create gallery item
exports.create = async (req, res) => {
	try {
		console.log('Create gallery request body:', req.body);
		console.log('Create gallery request file:', req.file);

		const {
			title,
			description,
			category,
			tags,
			featured,
			order,
			relatedCause,
			relatedEvent,
		} = req.body;

		// Handle image upload
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: 'Please upload an image',
			});
		}

		// Parse categories and tags if they exist
		let tagsArray = [];
		try {
			if (tags) tagsArray = JSON.parse(tags);
		} catch (e) {
			console.error('Error parsing tags:', e);
		}

		const galleryItem = new Gallery({
			title,
			description,
			image: req.file.filename,
			category: category || 'general',
			tags: tagsArray,
			featured: featured === 'true',
			order: order || 0,
			relatedCause,
			relatedEvent,
		});

		await galleryItem.save();
		res.status(201).json({
			success: true,
			data: galleryItem,
		});
	} catch (error) {
		console.error('Error creating gallery item:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Update gallery item
exports.update = async (req, res) => {
	try {
		const {
			title,
			description,
			category,
			tags,
			featured,
			order,
			relatedCause,
			relatedEvent,
		} = req.body;

		const galleryItem = await Gallery.findById(req.params.id);
		if (!galleryItem) {
			return res.status(404).json({ message: 'Gallery item not found' });
		}

		// Handle image upload
		if (req.file) {
			// Delete old image if exists
			if (galleryItem.image) {
				const oldImagePath = path.join(__dirname, '..', galleryItem.image);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}
			galleryItem.image = req.file.filename;
		}

		galleryItem.title = title || galleryItem.title;
		galleryItem.description = description || galleryItem.description;
		galleryItem.category = category || galleryItem.category;
		galleryItem.tags = tags ? JSON.parse(tags) : galleryItem.tags;
		galleryItem.featured = featured === 'true';
		galleryItem.order = order || galleryItem.order;
		galleryItem.relatedCause = relatedCause || galleryItem.relatedCause;
		galleryItem.relatedEvent = relatedEvent || galleryItem.relatedEvent;

		await galleryItem.save();
		res.status(200).json(galleryItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete gallery item
exports.delete = async (req, res) => {
	try {
		const galleryItem = await Gallery.findById(req.params.id);
		if (!galleryItem) {
			return res.status(404).json({ message: 'Gallery item not found' });
		}

		// Delete image if exists
		if (galleryItem.image) {
			const imagePath = path.join(__dirname, '..', galleryItem.image);
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
		}

		await Gallery.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: 'Gallery item deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update gallery item order
exports.updateOrder = async (req, res) => {
	try {
		const { items } = req.body;

		if (!Array.isArray(items)) {
			return res.status(400).json({ message: 'Invalid request format' });
		}

		const bulkOps = items.map((item) => ({
			updateOne: {
				filter: { _id: item._id },
				update: { $set: { order: item.order } },
			},
		}));

		await Gallery.bulkWrite(bulkOps);
		res.status(200).json({ message: 'Gallery order updated successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
