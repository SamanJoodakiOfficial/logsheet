const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const logger = require('../controllers/log.controller');
const flashAndRedirect = require('../utils/flashAndRedirect');

const renderRegisterPage = async (req, res) => {
    res.render('auth/register', { title: 'ثبت نام' })
}

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return flashAndRedirect(req, res, 'error', req.__('user_exists'), '/auth/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        logger('REGISTER', 'Authentication', req.userId, req.ip);
        flashAndRedirect(req, res, 'success', req.__('register_success'), '/auth/login');

    } catch (error) {
        console.error(error.message);
        flashAndRedirect(req, res, 'error', req.__('server_error'), '/auth/register')
    }
}

const renderLoginPage = async (req, res) => {
    res.render('auth/login', { title: 'ورود' });
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return flashAndRedirect(req, res, 'error', req.__('login_failed'), '/auth/login');
        }

        const checkPassword = await bcrypt.compare(password, existingUser.password);
        if (!checkPassword) {
            return flashAndRedirect(req, res, 'error', req.__('login_failed'), '/auth/login');
        }

        req.session.userId = existingUser._id;
        logger('LOGIN', 'Authentication', req.userId, req.ip);
        flashAndRedirect(req, res, 'success', req.__('login_success'), '/');

    } catch (error) {
        console.error(error.message);
        flashAndRedirect(req, res, 'error', req.__('server_error'), '/auth/login')
    }
}

const logout = async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.error(error.message);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
}

module.exports = {
    renderRegisterPage,
    renderLoginPage,
    register,
    login,
    logout
}