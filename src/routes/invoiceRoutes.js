const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const User = require('../models/User');
const Invoice = require('../models/Invoice');

// Middleware to ensure organization context exists
const requireOrg = (req, res, next) => {
    if (!req.organization || !req.dbConnection) {
        return res.redirect('/?error=Organization required');
    }
    next();
};

// GET route for invoice creation form
router.get('/organization/:orgId/create-invoice', async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.orgId);
        if (!organization) {
            return res.redirect('/');
        }
        const users = await User.find({ organization: organization._id });
        res.render('create-invoice', { 
            organization: {
                name: organization.name,
                _id: organization._id
            },
            users,
            error: null,
            formData: {}
        });
    } catch (error) {
        res.redirect('/?error=' + encodeURIComponent(error.message));
    }
});

// POST route to handle invoice creation
router.post('/organization/:orgId/create-invoice', async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.orgId);
        if (!organization) {
            throw new Error('Organization not found');
        }

        await Invoice.createAndProcess({
            organization: organization._id,
            fromUser: req.body.fromUser,
            toUser: req.body.toUser,
            amount: parseFloat(req.body.amount)
        });

        res.redirect(`/organization/${organization.name}`);
    } catch (error) {
        const organization = await Organization.findById(req.params.orgId);
        const users = await User.find({ organization: organization._id });
        res.render('create-invoice', {
            organization: {
                name: organization.name,
                _id: organization._id
            },
            users,
            error: error.message,
            formData: req.body
        });
    }
});

// GET route to list all invoices
router.get('/invoices', requireOrg, async (req, res) => {
    try {
        const Invoice = req.dbConnection.model('Invoice');
        const invoices = await Invoice.find({})
            .populate('fromUser')
            .populate('toUser');
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;