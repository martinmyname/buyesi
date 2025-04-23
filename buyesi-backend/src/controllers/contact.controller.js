const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
	try {
		const { name, email, subject, message, phone } = req.body;

		// Create new contact entry
		const contact = await Contact.create({
			name,
			email,
			subject,
			message,
			phone,
			ipAddress: req.ip,
		});

		// Send notification email to admin
		await sendEmail({
			to: process.env.EMAIL_USER,
			subject: `New Contact Form Submission: ${subject}`,
			text: `
        You have received a new contact form submission.
        
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        Subject: ${subject}
        
        Message:
        ${message}
        
        You can respond to this inquiry in your admin dashboard.
      `,
			html: `
        <h2>New Contact Form Submission</h2>
        <p>You have received a new contact form submission.</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
          <li><strong>Subject:</strong> ${subject}</li>
        </ul>
        <h3>Message:</h3>
        <p>${message}</p>
        <p>You can respond to this inquiry in your admin dashboard.</p>
      `,
		});

		// Send confirmation email to the user
		await sendEmail({
			to: email,
			subject: 'Thank you for contacting Buyesi Youth Initiative',
			text: `
        Dear ${name},
        
        Thank you for contacting Buyesi Youth Initiative. We have received your message and will get back to you shortly.
        
        For your reference, here's a copy of your message:
        
        Subject: ${subject}
        Message: ${message}
        
        If you have any further questions, please don't hesitate to contact us.
        
        Best regards,
        Buyesi Youth Initiative Team
      `,
			html: `
        <h2>Thank you for contacting Buyesi Youth Initiative</h2>
        <p>Dear ${name},</p>
        <p>Thank you for contacting Buyesi Youth Initiative. We have received your message and will get back to you shortly.</p>
        <p>For your reference, here's a copy of your message:</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>If you have any further questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Buyesi Youth Initiative Team</p>
      `,
		});

		res.status(201).json({
			success: true,
			message:
				'Your message has been sent successfully. We will contact you soon.',
			data: contact,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
exports.getContacts = async (req, res) => {
	try {
		// Query parameters
		const { status, limit = 10, page = 1 } = req.query;

		// Build query
		const query = {};

		// Filter by status
		if (status) {
			query.status = status;
		}

		// Pagination
		const skip = (parseInt(page) - 1) * parseInt(limit);

		// Execute query
		const contacts = await Contact.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		// Get total count
		const total = await Contact.countDocuments(query);

		res.status(200).json({
			success: true,
			count: contacts.length,
			total,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				pages: Math.ceil(total / parseInt(limit)),
			},
			data: contacts,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Get single contact submission
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContact = async (req, res) => {
	try {
		const contact = await Contact.findById(req.params.id);

		if (!contact) {
			return res.status(404).json({
				success: false,
				message: 'Contact submission not found',
			});
		}

		// Mark as read if it's new
		if (contact.status === 'new') {
			contact.status = 'read';
			await contact.save();
		}

		res.status(200).json({
			success: true,
			data: contact,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContact = async (req, res) => {
	try {
		const { status, response } = req.body;

		let contact = await Contact.findById(req.params.id);

		if (!contact) {
			return res.status(404).json({
				success: false,
				message: 'Contact submission not found',
			});
		}

		// Update status
		contact.status = status || contact.status;

		// Add response if provided
		if (response) {
			contact.response = {
				content: response,
				date: Date.now(),
				responder: req.user._id,
			};

			// Send response email to the contact
			await sendEmail({
				to: contact.email,
				subject: `Re: ${contact.subject}`,
				text: `
          Dear ${contact.name},
          
          Thank you for contacting Buyesi Youth Initiative. Here is our response to your inquiry:
          
          ${response}
          
          If you have any further questions, please don't hesitate to contact us.
          
          Best regards,
          Buyesi Youth Initiative Team
        `,
				html: `
          <h2>Response to your inquiry</h2>
          <p>Dear ${contact.name},</p>
          <p>Thank you for contacting Buyesi Youth Initiative. Here is our response to your inquiry:</p>
          <p>${response}</p>
          <p>If you have any further questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>Buyesi Youth Initiative Team</p>
        `,
			});
		}

		await contact.save();

		res.status(200).json({
			success: true,
			data: contact,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Delete contact submission
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = async (req, res) => {
	try {
		const contact = await Contact.findById(req.params.id);

		if (!contact) {
			return res.status(404).json({
				success: false,
				message: 'Contact submission not found',
			});
		}

		await contact.deleteOne();

		res.status(200).json({
			success: true,
			message: 'Contact submission deleted successfully',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
