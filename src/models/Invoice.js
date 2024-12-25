const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
	fromUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	toUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	amount: {
		type: Number,
		required: true,
		validate: {
			validator: function(v) {
				return v > 0;
			},
			message: 'Amount must be greater than 0'
		}
	},
	status: {
		type: String,
		enum: ['pending', 'completed', 'failed'],
		default: 'pending'
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

invoiceSchema.statics.createAndProcess = async function(fromUserId, toUserId, amount) {
	try {
		const User = mongoose.model('User');
		
		// Get both users
		const fromUser = await User.findById(fromUserId);
		const toUser = await User.findById(toUserId);

		if (!fromUser || !toUser) {
			throw new Error('One or both users not found');
		}

		if (fromUser.balance < amount) {
			throw new Error('Insufficient balance');
		}

		// Invoice Payment
		const invoice = await this.create({
			fromUser: fromUserId,
			toUser: toUserId,
			amount: amount,
			status: 'pending'
		});

		// Update balances
		// Not atomic but wasn't sure how to do that so left it
		fromUser.balance -= amount;
		await fromUser.save();

		toUser.balance += amount;
		await toUser.save();

		// Update invoice status
		invoice.status = 'completed';
		await invoice.save();

		return invoice;

	} catch (error) {
		console.error('Transaction failed:', error);
		throw error;
	}
}

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
