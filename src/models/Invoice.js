const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
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

invoiceSchema.statics.createAndProcess = async function(invoiceData) {
    try {
        const User = mongoose.model('User');
        
        // Get both users and verify they're in the same organization
        const [fromUser, toUser] = await Promise.all([
            User.findOne({ 
                _id: invoiceData.fromUser,
                organization: invoiceData.organization 
            }),
            User.findOne({ 
                _id: invoiceData.toUser,
                organization: invoiceData.organization 
            })
        ]);

        if (!fromUser || !toUser) {
            throw new Error('Invalid users or users from different organizations');
        }

        if (fromUser.balance < invoiceData.amount) {
            throw new Error('Insufficient balance');
        }

        // Create invoice
        const invoice = await this.create({
            ...invoiceData,
            status: 'pending'
        });

        // Update balances
        await User.updateOne(
            { _id: fromUser._id },
            { $inc: { balance: -invoiceData.amount } }
        );

        await User.updateOne(
            { _id: toUser._id },
            { $inc: { balance: invoiceData.amount } }
        );

        // Update invoice status
        await this.updateOne(
            { _id: invoice._id },
            { status: 'completed' }
        );

        return invoice;
    } catch (error) {
        throw error;
    }
};

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;