/**
 * Middleware to verify if the user is an admin
 * This should be used after the auth middleware
 */
const admin = (req, res, next) => {
	// This assumes the auth middleware has already been run
	// and has attached the user object to the request
	if (!req.user) {
		return res.status(401).json({ message: 'Unauthorized - No user found' });
	}

	if (req.user.role !== 'admin') {
		return res
			.status(403)
			.json({ message: 'Forbidden - Admin access required' });
	}

	next();
};

module.exports = admin;
