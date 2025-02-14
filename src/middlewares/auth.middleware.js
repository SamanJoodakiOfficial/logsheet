const User = require('../models/user.model');
const flashAndRedirect = require('../utils/flashAndRedirect');
const i18n = require('../config/i18n');

const isAuthenticated = async (req, res, next) => {
    if (req.session.userId) {
        return next();
    }

    flashAndRedirect(req, res, 'info', req.__('please_login'), '/auth/login');
}

const isGuest = (req, res, next) => {
    if (!req.session.userId) {
        return next();
    }

    flashAndRedirect(req, res, 'info', req.__('already_logged_in'), '/');
};

module.exports = {
    isAuthenticated,
    isGuest
}