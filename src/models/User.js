const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	firstName: {
		type: String,
		required: true,
		trim: true
	},
	lastName: {
		type: String,
		required: true,
		trim: true
	},
	balance: {
		type: Number,
		default: 0,
		validate: {
			validator: function(v) {
				return typeof v === 'number'; // Can be negative initial balance but then they can't transfer funds
			}
		}
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

userSchema.methods.updateBalance = async function(amount) {
	this.balance += amount;
	return this.save();
};

userSchema.statics.findByUsername = function(username) {
	return this.findOne({ username: username });
};

userSchema.statics.createNewUser = async function(userData) {
	try {
		const existingUser = await this.findByUsername(userData.username);
		if (existingUser) {
			throw new Error('Username already exists');
		}
		return this.create(userData);
	} catch (error) {
		throw error;
	}
};

const User = mongoose.model('User', userSchema);

module.exports = User;
