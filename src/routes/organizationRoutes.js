const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const User = require('../models/User');
const Invoice = require('../models/Invoice');

// GET route for organization creation form
router.get('/create-organization', (req, res) => {
    res.render('create-organization');
});

// POST route to handle organization creation
router.post('/create-organization', async (req, res) => {
    try {
        const org = await Organization.createNewOrganization({
            name: req.body.name
        });
        res.redirect('/');
    } catch (error) {
        res.render('create-organization', { 
            error: error.message,
            formData: req.body 
        });
    }
});

// Changed from :id to :name
router.get('/organization/:name', async (req, res) => {
    try {
        const organization = await Organization.findOne({ name: req.params.name });
        if (!organization) {
            return res.redirect('/?error=Organization not found');
        }
        const users = await User.find({ organization: organization._id });
        res.render('organization-dashboard', { 
            organization: {
                name: organization.name,
                _id: organization._id
            }, 
            users 
        });
    } catch (error) {
        res.redirect('/?error=' + encodeURIComponent(error.message));
    }
});

module.exports = router;