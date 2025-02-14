const express = require('express');
const router = express.Router();

const {
    renderRegisterPage,
    renderLoginPage,
    register,
    login
} = require('../controllers/auth.controller');

// Login routes
router.get('/login', renderLoginPage);
router.post('/login', login);

// Register routes
router.get('/register', renderRegisterPage);
router.post('/register', register);

module.exports = router;