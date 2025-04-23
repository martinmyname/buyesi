const Event = require('../models/Event');
const path = require('path');
const fs = require('fs');

// Get all events
exports.getAll = async (req, res) => {
	try {
		const { status, featured } = req.query;
		const query = {};

		if (status) query.status = status;
		if (featured) query.featured = featured === 'true';

		const events = await Event.find(query).sort({ startDate: 1 });
		res.status(200).json(events);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get event by ID or slug
exports.getById = async (req, res) => {
	try {
		const event = await Event.findOne({
			$or: [{ _id: req.params.id }, { slug: req.params.id }],
		});

		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}

		res.status(200).json(event);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create event
exports.create = async (req, res) => {
	try {
		console.log('Create event request body:', req.body);
		console.log('Create event request file:', req.file);

		const { title, description, location, startDate, endDate, slug } = req.body;

		// Validate required fields
		if (
			!title ||
			!description ||
			!location ||
			!startDate ||
			!endDate ||
			!slug
		) {
			return res.status(400).json({
				success: false,
				message: 'All fields are required',
				missingFields: {
					title: !title,
					description: !description,
					location: !location,
					startDate: !startDate,
					endDate: !endDate,
					slug: !slug,
				},
			});
		}

		// Handle image upload
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: 'Please upload an image',
			});
		}

		// Create event
		const event = await Event.create({
			title,
			description,
			location,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			slug,
			image: `/uploads/events/${req.file.filename}`,
			status: 'upcoming',
			featured: false,
			registrationRequired: false,
			maximumAttendees: 0,
		});

		res.status(201).json({
			success: true,
			data: event,
		});
	} catch (error) {
		console.error('Error creating event:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Update event
exports.update = async (req, res) => {
	try {
		const {
			title,
			description,
			startDate,
			endDate,
			location,
			address,
			organizer,
			status,
			featured,
			registrationRequired,
			maximumAttendees,
		} = req.body;

		const event = await Event.findById(req.params.id);
		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}

		// Handle image upload
		if (req.file) {
			// Delete old image if exists
			if (event.image) {
				const oldImagePath = path.join(__dirname, '..', event.image);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}
			event.image = `/uploads/events/${req.file.filename}`;
		}

		event.title = title || event.title;
		event.description = description || event.description;
		event.startDate = startDate || event.startDate;
		event.endDate = endDate || event.endDate;
		event.location = location || event.location;
		event.address = address || event.address;
		event.organizer = organizer || event.organizer;
		event.status = status || event.status;
		event.featured = featured === 'true';
		event.registrationRequired = registrationRequired === 'true';
		event.maximumAttendees = maximumAttendees || event.maximumAttendees;

		await event.save();
		res.status(200).json(event);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete event
exports.delete = async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);
		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}

		// Delete image if exists
		if (event.image) {
			const imagePath = path.join(__dirname, '..', event.image);
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
		}

		await Event.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: 'Event deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Register attendee
exports.registerAttendee = async (req, res) => {
	try {
		const { name, email, phone } = req.body;
		const event = await Event.findById(req.params.id);

		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}

		if (!event.registrationRequired) {
			return res
				.status(400)
				.json({ message: 'Event does not require registration' });
		}

		if (event.status !== 'upcoming') {
			return res.status(400).json({ message: 'Event registration is closed' });
		}

		if (
			event.maximumAttendees > 0 &&
			event.attendees.length >= event.maximumAttendees
		) {
			return res.status(400).json({ message: 'Event is full' });
		}

		// Check if attendee is already registered
		const existingAttendee = event.attendees.find(
			(attendee) => attendee.email === email
		);
		if (existingAttendee) {
			return res
				.status(400)
				.json({ message: 'You are already registered for this event' });
		}

		event.attendees.push({
			name,
			email,
			phone,
			registrationDate: Date.now(),
		});

		await event.save();
		res.status(201).json(event);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Remove attendee
exports.removeAttendee = async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);
		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}

		const attendeeIndex = event.attendees.findIndex(
			(attendee) => attendee._id.toString() === req.params.attendeeId
		);

		if (attendeeIndex === -1) {
			return res.status(404).json({ message: 'Attendee not found' });
		}

		event.attendees.splice(attendeeIndex, 1);
		await event.save();
		res.status(200).json(event);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
