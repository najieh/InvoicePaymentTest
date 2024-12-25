const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import route handlers
const userRoutes = require('./routes/userRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const User = require('./models/User');

class InvoiceApp {
	constructor() {
		this.app = express();
		this.configureMiddleware();
		this.configureDatabase();
		this.configureRoutes();
	}

	configureMiddleware() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.static(path.join(__dirname, 'public')));
		this.app.set('view engine', 'ejs');
		this.app.set('views', path.join(__dirname, 'views'));
	}

	async configureDatabase() {
		try {
			await mongoose.connect(process.env.MONGODB_URI);
			console.log('Successfully connected to MongoDB');
		} catch (error) {
			console.error('MongoDB connection error:', error);
		}
	}

	configureRoutes() {
		this.app.get('/', async (req, res) => {
			try {
				const users = await User.find({});
				res.render('index', { users });
			} catch (error) {
				res.render('index', { users: [] });
			}
		});

		// Connect our route modules for users and invoices
		this.app.use('/', userRoutes);
		this.app.use('/', invoiceRoutes);
	}

	start(port) {
		this.app.listen(port, () => {
			console.log(`Server is running on http://localhost:${port}`);
		});
	}
}

const app = new InvoiceApp();
app.start(process.env.PORT || 3000);

module.exports = app;