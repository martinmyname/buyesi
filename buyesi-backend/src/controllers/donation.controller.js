const Donation = require('../models/Donation');
const Cause = require('../models/Cause');

// Get all donations
exports.getAll = async (req, res) => {
	try {
		const { cause, status, paymentMethod } = req.query;
		const query = {};

		if (cause) query.cause = cause;
		if (status) query.status = status;
		if (paymentMethod) query.paymentMethod = paymentMethod;

		const donations = await Donation.find(query)
			.populate('cause', 'title')
			.sort({ createdAt: -1 });
		res.status(200).json(donations);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get donation by ID
exports.getById = async (req, res) => {
	try {
		const donation = await Donation.findById(req.params.id).populate(
			'cause',
			'title'
		);

		if (!donation) {
			return res.status(404).json({ message: 'Donation not found' });
		}

		res.status(200).json(donation);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create donation
exports.create = async (req, res) => {
	try {
		const {
			cause,
			amount,
			name,
			email,
			phone,
			message,
			anonymous,
			paymentMethod,
		} = req.body;

		// Verify cause exists
		const causeExists = await Cause.findById(cause);
		if (!causeExists) {
			return res.status(404).json({ message: 'Cause not found' });
		}

		const donation = new Donation({
			cause,
			amount,
			name,
			email,
			phone,
			message,
			anonymous,
			paymentMethod: paymentMethod || 'other',
			status: 'pending',
		});

		await donation.save();
		res.status(201).json(donation);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update donation status
exports.updateStatus = async (req, res) => {
	try {
		const { status, transactionId } = req.body;

		const donation = await Donation.findById(req.params.id);
		if (!donation) {
			return res.status(404).json({ message: 'Donation not found' });
		}

		donation.status = status || donation.status;
		donation.transactionId = transactionId || donation.transactionId;

		await donation.save();
		res.status(200).json(donation);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Mark donation receipt as sent
exports.markReceiptSent = async (req, res) => {
	try {
		const donation = await Donation.findById(req.params.id);
		if (!donation) {
			return res.status(404).json({ message: 'Donation not found' });
		}

		donation.receiptSent = true;
		await donation.save();
		res.status(200).json(donation);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get donation statistics
exports.getStatistics = async (req, res) => {
	try {
		const { cause, startDate, endDate } = req.query;
		const query = { status: 'completed' };

		if (cause) query.cause = cause;
		if (startDate || endDate) {
			query.createdAt = {};
			if (startDate) query.createdAt.$gte = new Date(startDate);
			if (endDate) query.createdAt.$lte = new Date(endDate);
		}

		const totalDonations = await Donation.countDocuments(query);
		const totalAmount = await Donation.aggregate([
			{ $match: query },
			{ $group: { _id: null, total: { $sum: '$amount' } } },
		]);

		const paymentMethodStats = await Donation.aggregate([
			{ $match: query },
			{ $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
		]);

		const causeStats = await Donation.aggregate([
			{ $match: query },
			{
				$group: {
					_id: '$cause',
					count: { $sum: 1 },
					total: { $sum: '$amount' },
				},
			},
			{ $sort: { total: -1 } },
		]);

		// Populate cause names
		const causeIds = causeStats.map((stat) => stat._id);
		const causes = await Cause.find({ _id: { $in: causeIds } }, 'title');
		const causeMap = causes.reduce((acc, cause) => {
			acc[cause._id.toString()] = cause.title;
			return acc;
		}, {});

		const statistics = {
			totalDonations,
			totalAmount: totalAmount[0]?.total || 0,
			paymentMethodStats,
			causeStats: causeStats.map((stat) => ({
				cause: causeMap[stat._id.toString()] || 'Unknown Cause',
				count: stat.count,
				total: stat.total,
			})),
		};

		res.status(200).json(statistics);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
