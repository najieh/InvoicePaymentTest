const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const User = require('../models/User');

// GET route for invoice creation form
router.get('/create-invoice', async (req, res) => {
	try {
		const users = await User.find({}, 'username _id');
		res.render('create-invoice', { users });
	} catch (error) {
		res.redirect('/');
	}
});

// POST route to handle invoice creation
router.post('/create-invoice', async (req, res) => {
	try {
		const { fromUser, toUser, amount } = req.body;
		
		const invoice = await Invoice.createAndProcess(
			fromUser,
			toUser,
			parseFloat(amount)
		);

		res.redirect('/');
	} catch (error) {
		const users = await User.find({}, 'username _id');
		res.render('create-invoice', { 
			users,
			error: error.message,
			formData: req.body 
		});
	}
});

module.exports = router;
