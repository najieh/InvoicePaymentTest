const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    username: {
        type: String,
        required: true,
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
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for unique usernames within an organization
userSchema.index({ organization: 1, username: 1 }, { unique: true });

userSchema.statics.createNewUser = async function(userData) {
    try {
        const existingUser = await this.findOne({ 
            organization: userData.organization,
            username: userData.username 
        });
        
        if (existingUser) {
            throw new Error('Username already exists in this organization');
        }
        
        return this.create(userData);
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;