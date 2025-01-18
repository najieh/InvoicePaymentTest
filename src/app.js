const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const configureMiddleware = require('./middleware');
const configureRoutes = require('./routes');

class InvoiceApp {
    constructor() {
        this.app = express();
        this.setupApplication();
    }

    async setupApplication() {
        configureMiddleware(this.app);
        await this.configureDatabase();
        configureRoutes(this.app);
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

    start(port) {
        this.app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
}

const app = new InvoiceApp();
app.start(process.env.PORT || 3000);

module.exports = app;