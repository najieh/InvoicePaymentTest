const organizationRoutes = require('./organizationRoutes');
const userRoutes = require('./userRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const Organization = require('../models/Organization');

const configureRoutes = (app) => {
    // Home route
    app.get('/', async (req, res) => {
        const organizations = await Organization.find({});
        res.render('index', { organizations });
    });

    // Register all routes
    app.use('/', organizationRoutes);
    app.use('/', userRoutes);
    app.use('/', invoiceRoutes);

    // Error handling
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).render('error', { error: err.message });
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).render('error', { error: 'Page not found' });
    });
};

module.exports = configureRoutes;