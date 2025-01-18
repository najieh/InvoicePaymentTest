const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const organizationRoutes = require('./routes/organizationRoutes');
const userRoutes = require('./routes/userRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

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
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }

    configureRoutes() {
        // Home route
        this.app.get('/', async (req, res) => {
            const Organization = require('./models/Organization');
            const organizations = await Organization.find({});
            res.render('index', { organizations });
        });

        // Use routes
        this.app.use('/', organizationRoutes);
        this.app.use('/', userRoutes);
        this.app.use('/', invoiceRoutes);

        // Error handling
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).render('error', { error: err.message });
        });

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).render('error', { error: 'Page not found' });
        });
    }

    start(port) {
        this.app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
}

const app = new InvoiceApp();
app.start(process.env.PORT || 3000);

module.exports = app;