const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET route for user creation form
router.get('/create-user', (req, res) => {
	res.render('create-user');
});

// POST route to handle user creation
router.post('/create-user', async (req, res) => {
	try {
		const userData = {
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			balance: parseFloat(req.body.balance) || 0
		};

		await User.createNewUser(userData);
		res.redirect('/');
	} catch (error) {
		res.render('create-user', { 
			error: error.message,
			formData: req.body 
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
