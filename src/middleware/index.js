const express = require('express');
const path = require('path');

const configureMiddleware = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../public')));
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));
};

module.exports = configureMiddleware;