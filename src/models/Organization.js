const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

organizationSchema.statics.createNewOrganization = async function(orgData) {
    try {
        return await this.create(orgData);
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Organization name already exists');
        }
        throw error;
    }
};

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;