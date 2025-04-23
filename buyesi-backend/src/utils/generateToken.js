const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token
 * @param {String} id - User ID to encode in the token
 * @returns {String} - JWT token
 */
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE || '30d',
	});
};

module.exports = generateToken;
