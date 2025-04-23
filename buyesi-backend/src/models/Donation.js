const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
	{
		cause: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Cause',
			required: true,
		},
		amount: {
			type: Number,
			required: [true, 'Amount is required'],
			min: [1, 'Amount must be greater than 0'],
		},
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			trim: true,
			match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
		},
		phone: {
			type: String,
			default: '',
		},
		message: {
			type: String,
			default: '',
		},
		anonymous: {
			type: Boolean,
			default: false,
		},
		transactionId: {
			type: String,
			default: '',
		},
		paymentMethod: {
			type: String,
			enum: ['credit_card', 'paypal', 'bank_transfer', 'other'],
			default: 'other',
		},
		status: {
			type: String,
			enum: ['pending', 'completed', 'failed', 'refunded'],
			default: 'pending',
		},
		receiptSent: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// Update the cause's raised amount when a donation is completed
donationSchema.post('save', async function () {
	if (this.status === 'completed') {
		const Cause = mongoose.model('Cause');
		await Cause.findByIdAndUpdate(this.cause, {
			$inc: { raisedAmount: this.amount },
			$push: { donations: this._id },
			lastDonationDate: Date.now(),
		});
	}
});

module.exports = mongoose.model('Donation', donationSchema);
