const dotenv = require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');

const connectDB = require('./config/database');

const User = require('./models/user.model');

const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost:27017/grc';

// Express configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Template engine
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: databaseURL,
        collectionName: 'sessions',
        ttl: 1000 * 60 * 60 * 24 * 30, // 30 Days
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: true
    }
}));

// Flash session configuration
app.use(flash());
app.use(async (req, res, next) => {
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    res.locals.infoMessages = req.flash('info');

    if (req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);
            res.locals.user = user ? {
                _id: user._id,
                email: user.email,
                password: user.password,
            } : null;
        } catch (error) {
            console.error('Error fetching user:', error.message);
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

// i18n
const i18n = require('./config/i18n');
app.use(i18n.init);

connectDB(databaseURL)
    .then((data) => {
        console.log(`[DATABASE] Connected to database: ${databaseURL}`);

        app.listen(port, () => {
            console.log(`[WEB SERVER] Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('[-] Failed to connect to database');
        console.error(error.message);
        process.exit(1);
    });

// Routes
app.use('/', require('./routes/index.routes'));