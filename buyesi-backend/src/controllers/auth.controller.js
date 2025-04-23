const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Check if user already exists
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({
				success: false,
				message: 'User already exists',
			});
		}

		// Create new user
		const user = await User.create({
			name,
			email,
			password,
		});

		// Generate token
		const token = generateToken(user._id);

		res.status(201).json({
			success: true,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			token,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check if user exists
		const user = await User.findOne({ email }).select('+password');
		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid credentials',
			});
		}

		// Check if password matches
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: 'Invalid credentials',
			});
		}

		// Generate token
		const token = generateToken(user._id);

		res.status(200).json({
			success: true,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			token,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
	try {
		// User is already available in req due to auth middleware
		res.status(200).json({
			success: true,
			user: {
				_id: req.user._id,
				name: req.user.name,
				email: req.user.email,
				role: req.user.role,
				avatar: req.user.avatar,
				createdAt: req.user.createdAt,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		// Find user
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'No user found with that email',
			});
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString('hex');

		// Hash token and set to resetPasswordToken field
		user.resetPasswordToken = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex');

		// Set expiration time
		user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

		await user.save();

		// Create reset URL
		const resetUrl = `${req.protocol}://${req.get(
			'host'
		)}/api/auth/resetpassword/${resetToken}`;

		// Create email message
		const message = `
      You are receiving this email because you (or someone else) has requested the reset of a password.
      Please click on the following link to reset your password:
      \n\n
      ${resetUrl}
      \n\n
      This link will expire in 10 minutes.
      \n\n
      If you did not request this, please ignore this email and your password will remain unchanged.
    `;

		try {
			await sendEmail({
				to: user.email,
				subject: 'Password Reset Request',
				text: message,
			});

			res.status(200).json({
				success: true,
				message: 'Password reset email sent',
			});
		} catch (error) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;
			await user.save();

			return res.status(500).json({
				success: false,
				message: 'Email could not be sent',
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
	try {
		// Hash the token from URL params
		const resetPasswordToken = crypto
			.createHash('sha256')
			.update(req.params.resettoken)
			.digest('hex');

		// Find user by token and check if token has not expired
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Invalid or expired token',
			});
		}

		// Set new password
		user.password = req.body.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save();

		// Generate new token
		const token = generateToken(user._id);

		res.status(200).json({
			success: true,
			message: 'Password reset successful',
			token,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Update user password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		// Get user with password
		const user = await User.findById(req.user._id).select('+password');

		// Check if current password matches
		const isMatch = await user.comparePassword(currentPassword);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: 'Current password is incorrect',
			});
		}

		// Update password
		user.password = newPassword;
		await user.save();

		// Generate new token
		const token = generateToken(user._id);

		res.status(200).json({
			success: true,
			message: 'Password updated successfully',
			token,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
