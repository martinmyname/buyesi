// Mock nodemailer implementation that doesn't attempt to send any emails
// const nodemailer = require('nodemailer');

/**
 * Send email using nodemailer - MOCK VERSION
 * This is a mock implementation that logs the email but doesn't actually send it
 * It will always succeed and never cause errors
 *
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.text - Plain text email content
 * @param {String} options.html - HTML email content
 * @returns {Promise} - Resolves with mock success info
 */
const sendEmail = async (options) => {
	// Log the email attempt but don't actually send
	console.log('MOCK EMAIL: Would have sent email with the following details:');
	console.log('  To:', options.to);
	console.log('  Subject:', options.subject);
	console.log('  Content length:', (options.text || '').length, 'characters');

	// Return mock success response
	return {
		status: 'success',
		message: 'Email sending skipped in current configuration',
		mockDelivery: true,
		to: options.to,
		subject: options.subject,
	};
};

module.exports = sendEmail;
