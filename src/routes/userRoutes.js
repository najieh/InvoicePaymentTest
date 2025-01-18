const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Organization = require('../models/Organization');

// GET route for user creation form
router.get('/organization/:orgId/create-user', async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.orgId);
        if (!organization) {
            return res.redirect('/');
        }
        res.render('create-user', { 
            organization: {
                name: organization.name,
                _id: organization._id
            }
        });
    } catch (error) {
        res.redirect('/?error=' + encodeURIComponent(error.message));
    }
});

// POST route to handle user creation
router.post('/organization/:orgId/create-user', async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.orgId);
        if (!organization) {
            throw new Error('Organization not found');
        }

        const newUser = await User.createNewUser({
            organization: organization._id,
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            balance: parseFloat(req.body.balance) || 0
        });

        res.redirect(`/organization/${organization.name}`);
    } catch (error) {
        const organization = await Organization.findById(req.params.orgId);
        res.render('create-user', {
            error: error.message,
            formData: req.body,
            organization: {
                name: organization.name,
                _id: organization._id
            }
        });
    }
});

// GET route to list all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;