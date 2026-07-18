require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('passport');

const connectDB = require('./src/config/db');
const { seedContestTypes } = require('./src/schemas');
require('./src/config/passport'); // Load Passport configuration

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const contestRoutes = require('./src/routes/contestRoutes');
const startReminderCron = require('./src/cron/reminderCron');

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60 // 14 days, matches default session cookie maxAge behavior
    })
}));

app.use(passport.initialize());
app.use(passport.session());

// Database Initialization
connectDB().then(() => {
    seedContestTypes();
});

// Mounting Router Middleware
app.use(authRoutes);
app.use(userRoutes);
app.use(contestRoutes);

// Launch Schedulers
startReminderCron();
console.log('⏰ Schedulers initialized');

// Server Listener
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
