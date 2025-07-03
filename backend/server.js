require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { Sequelize, DataTypes, Op } = require('sequelize');
const { google } = require('googleapis');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ----- 1) Initialize Sequelize (MySQL) -----
const FIXED_TYPES = {
    Weekly: 1,
    Biweekly: 2,
    Div1: 3,
    Div2: 4,
    Div3: 5,
    Div4: 6,
    Other: 7
};

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        pool: { max: 5, min: 0, idle: 10000 }
    }
);

// Test DB connection\sequelize.authenticate()
// Test DB connection
sequelize.authenticate()
    .then(() => console.log('🔗 MySQL connected'))
    .catch(err => console.error('MySQL connection error:', err));


// ----- 2) Define Models -----
// const User = sequelize.define('User', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     googleId: { type: DataTypes.STRING, unique: true, allowNull: false },
//     name: { type: DataTypes.STRING },
//     email: { type: DataTypes.STRING, unique: true }
// }, {
//     tableName: 'users',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: false
// });

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    googleId: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    accessToken: { type: DataTypes.TEXT },
    refreshToken: { type: DataTypes.TEXT },
    photo: { type: DataTypes.STRING }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});


const Platform = sequelize.define('Platform', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true }
}, {
    tableName: 'platforms',
    timestamps: false
});

const ContestType = sequelize.define('ContestType', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'contest_types',
    timestamps: false
});

// Join table: which user wants which contest types
const ReminderPreference = sequelize.define('ReminderPreference', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
}, {
    tableName: 'reminder_preferences',
    timestamps: false
});

// const Contest = sequelize.define('Contest', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     name: { type: DataTypes.STRING, allowNull: false },
//     startTime: { type: DataTypes.INTEGER, allowNull: false },
//     duration: { type: DataTypes.INTEGER, allowNull: false }
// }, {
//     tableName: 'contests',
//     timestamps: false
// });
const Contest = sequelize.define('Contest', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.INTEGER, allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false }
    // plus your PlatformId and ContestTypeId foreign keys…
}, {
    tableName: 'contests',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['PlatformId', 'name', 'startTime']
        }
    ]
});


// const CalendarEvent = sequelize.define('CalendarEvent', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     eventId: { type: DataTypes.STRING, allowNull: false },  // Google Calendar event ID
// }, {
//     tableName: 'calendar_events',
//     timestamps: false
// });
const CalendarEvent = sequelize.define('CalendarEvent', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    eventId: { type: DataTypes.STRING, allowNull: false },
    UserId: { type: DataTypes.INTEGER, allowNull: false },
    ContestId: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'calendar_events',
    timestamps: false
});


// ----- 3) Associations -----
User.belongsToMany(ContestType, { through: ReminderPreference });
ContestType.belongsToMany(User, { through: ReminderPreference });

Platform.hasMany(Contest);
Contest.belongsTo(Platform);
ContestType.hasMany(Contest);
Contest.belongsTo(ContestType);

User.hasMany(CalendarEvent);
CalendarEvent.belongsTo(User);

Contest.hasMany(CalendarEvent);
CalendarEvent.belongsTo(Contest);


// ----- 4) Sync Models -----
// sequelize.sync()
//     .then(() => console.log('✅ Models synced'))
//     .catch(err => console.error('Sync error:', err));

sequelize.sync()
    .then(async () => {
        console.log('✅ Models synced — now seeding contest_types');

        // Upsert each fixed type by its ID & name
        for (const [name, id] of Object.entries(FIXED_TYPES)) {
            // upsert will INSERT if not exists, or UPDATE name if it does
            await ContestType.upsert({ id, name });
        }

        console.log('✅ contest_types seeded');
    })
    .catch(err => console.error('Sync error:', err));


// ----- 5) Session & Passport Setup -----
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://contest-alert-production.up.railway.app/auth/google/callback',
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.events'], // ✅ Calendar permission
    accessType: 'offline',  // ✅ needed to get refreshToken
    prompt: 'consent'       // ✅ force Google to send refreshToken
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [user] = await User.findOrCreate({
            where: { googleId: profile.id },
            defaults: {
                name: profile.displayName,
                email: profile.emails[0].value,
                photo: profile.photos?.[0]?.value || null
            }
        });

        // ✅ Store the tokens in DB (overwrite old ones if they exist)
        user.accessToken = accessToken;
        if (refreshToken) user.refreshToken = refreshToken; // may be undefined on repeated login
        await user.save();

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user || null);
    } catch (err) {
        done(err, null);
    }
});

// ----- 6) Auth Routes -----
app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: [
            'profile',
            'email',
            'https://www.googleapis.com/auth/calendar.events',
            'openid'
        ],
        accessType: 'offline',
        prompt: 'consent'
    })
);


app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            const user = req.user;
            //await axios.post('http://localhost:5001/api/updateContests'); // ⬅️ Add this

            const prefs = await user.getContestTypes();
            if (!prefs.length) {
                return res.redirect(`${process.env.REACT_APP_FRONTEND_URL}`);
            }

            const now = Math.floor(Date.now() / 1000);
            const contests = await Contest.findAll({
                where: {
                    startTime: { [Op.gt]: now },
                    ContestTypeId: prefs.map(p => p.id)
                },
                include: [Platform]
            });

            for (const contest of contests) {
                try {
                    // await createCalendarEvent(user, contest);
                    const existing = await CalendarEvent.findOne({
                        where: {
                            UserId: user.id,
                            ContestId: contest.id
                        }
                    });

                    if (!existing) {
                        const eventId = await createCalendarEvent(user, contest);
                        await CalendarEvent.create({
                            eventId,
                            UserId: user.id,
                            ContestId: contest.id
                        });
                        console.log(`✅ Event added to calendar: ${contest.name}`);
                    } else {
                        console.log(`⚠️ Skipping existing event: ${contest.name}`);
                    }

                    console.log(`✅ Event added to calendar: ${contest.name}`);
                } catch (err) {
                    console.error(`❌ Calendar error for ${contest.name}:`, err.message);
                }
                await new Promise(r => setTimeout(r, 500)); // Optional: prevent spam
            }

            res.redirect(`${process.env.REACT_APP_FRONTEND_URL}`);
        } catch (err) {
            console.error('OAuth calendar insertion failed:', err);
            res.redirect('/login');
        }
    }
);

app.get('/auth/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.json({ message: 'Signed out successfully.' });
        });
    });
});

// ----- 7) User Preferences Endpoints -----
// Get all available contest types
app.get('/api/contest-types', async (req, res) => {
    const types = await ContestType.findAll();
    res.json(types);
});

// Update user's reminder preferences
app.post('/api/user/preferences', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    const { contestTypeIds } = req.body; // e.g. [1, 2, 5]
    try {
        await req.user.setContestTypes(contestTypeIds);
        res.json({ message: 'Preferences updated' });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
});

// Get user's reminder preferences
app.get('/api/user/preferences', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    const prefs = await req.user.getContestTypes();
    res.json(prefs);
});

app.get('/api/user/info', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    // Load the user’s contest‐type preferences
    const prefs = await req.user.getContestTypes({
        attributes: ['id', 'name']
    });

    res.json({
        name: req.user.name,
        email: req.user.email,
        preferences: prefs,   // e.g. [{ id: 1, name: 'Weekly' }, …]

    });
});



function parseCodeforcesType(name) {
    if (/Div\. 1/i.test(name)) return 'Div1';
    if (/Div\. 2/i.test(name)) return 'Div2';
    if (/Div\. 3/i.test(name)) return 'Div3';
    if (/Div\. 4/i.test(name)) return 'Div4';
    if (/Educational/i.test(name)) return 'Div2'; // Optional: map Educational to Div2
    return 'Other';
}
``
async function fetchCodeforcesContests() {
    const response = await fetch('https://codeforces.com/api/contest.list');
    const json = await response.json();

    if (json.status !== 'OK') {
        throw new Error('Failed to fetch Codeforces contests');
    }

    const now = Math.floor(Date.now() / 1000);

    const upcoming = json.result
        .filter(contest => contest.phase === 'BEFORE' && contest.startTimeSeconds > now)
        .map(contest => ({
            platformName: 'Codeforces',
            name: contest.name,
            startTime: contest.startTimeSeconds,
            duration: contest.durationSeconds,
            typeName: parseCodeforcesType(contest.name)  // Apply parsing logic here
        }));

    return upcoming;
}




// function getNextWeeklyContest(now) {
//     let days = (7 - now.getDay()) % 7;
//     if (now.getDay() === 0) { let t = new Date(now); t.setUTCHours(14, 30, 0, 0); days = now < t ? 0 : 7; }
//     let d = new Date(now); d.setDate(d.getDate() + days); d.setUTCHours(14, 30, 0, 0);
//     return d;
// }
function getNextWeeklyContest(now) {
    const result = new Date(now);
    const day = result.getUTCDay();
    const hour = result.getUTCHours();
    const minute = result.getUTCMinutes();

    // Set to upcoming Sunday
    let daysUntilSunday = (7 - day) % 7;
    if (day === 0 && (hour < 2 || (hour === 2 && minute < 30))) {
        daysUntilSunday = 0; // Today before 2:30 UTC
    } else if (day === 0) {
        daysUntilSunday = 7;
    }

    result.setUTCDate(result.getUTCDate() + daysUntilSunday);
    result.setUTCHours(2, 30, 0, 0); // 2:30 UTC = 8:00 AM IST
    return result;
}


function getNextBiweeklyContest(now) {
    const reference = new Date(Date.UTC(2022, 0, 8, 14, 30)); // Jan 8, 2022, 8 PM IST = 14:30 UTC
    const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;
    let diff = now - reference;
    let periods = Math.floor(diff / twoWeeksMs);

    let candidate = new Date(reference.getTime() + periods * twoWeeksMs);
    if (candidate <= now) {
        candidate = new Date(candidate.getTime() + twoWeeksMs);
    }

    return candidate;
}

function computeUpcomingLeetCodeContests() {
    const now = new Date();
    const w1 = getNextWeeklyContest(now);
    const w2 = new Date(w1.getTime() + 7 * 24 * 60 * 60 * 1000);

    const b1 = getNextBiweeklyContest(now);
    const b2 = new Date(b1.getTime() + 14 * 24 * 60 * 60 * 1000);

    const contests = [
        { platformName: 'LeetCode', name: 'LeetCode Weekly Contest', startTime: Math.floor(w1 / 1000), duration: 5400, typeName: 'Weekly' },
        { platformName: 'LeetCode', name: 'LeetCode Weekly Contest', startTime: Math.floor(w2 / 1000), duration: 5400, typeName: 'Weekly' },
        { platformName: 'LeetCode', name: 'LeetCode Biweekly Contest', startTime: Math.floor(b1 / 1000), duration: 5400, typeName: 'Biweekly' },
        { platformName: 'LeetCode', name: 'LeetCode Biweekly Contest', startTime: Math.floor(b2 / 1000), duration: 5400, typeName: 'Biweekly' }
    ];

    return contests
        .filter(c => c.startTime > Math.floor(now.getTime() / 1000))
        .sort((a, b) => a.startTime - b.startTime)
        .slice(0, 3);
}

function parseCodeforcesType(name) {
    if (/Div\. 1/i.test(name)) return 'Div1';
    if (/Div\. 2/i.test(name)) return 'Div2';
    if (/Div\. 3/i.test(name)) return 'Div3';
    if (/Div\. 4/i.test(name)) return 'Div4';
    if (/Educational/i.test(name)) return 'Div2'; // Optional logic
    return 'Other';
}

// 
app.post('/api/updateContests', async (req, res) => {
    try {
        const now = Math.floor(Date.now() / 1000);
        await Contest.destroy({
            where: {
                startTime: { [Op.lt]: now - 3600 } // delete contests that ended >1hr ago
            }
        });

        const cfData = await fetchCodeforcesContests();
        const lcData = computeUpcomingLeetCodeContests();
        const allData = [...cfData, ...lcData];

        const fixedTypeMap = {
            'Weekly': 1,
            'Biweekly': 2,
            'Other': 7,
            'Div1': 3,
            'Div2': 4,
            'Div3': 5,
            'Div4': 6
        };

        // Upsert Platforms and ContestTypes
        const platforms = {};
        const types = {};
        for (const row of allData) {
            if (!platforms[row.platformName]) {
                platforms[row.platformName] = await Platform.findOrCreate({
                    where: { name: row.platformName }
                }).then(r => r[0]);
            }
            if (!types[row.typeName]) {
                const id = fixedTypeMap[row.typeName] || fixedTypeMap['Other'];
                types[row.typeName] = await ContestType.findByPk(id);
            }
        }

        // ✅ Upsert contests instead of deleting all
        for (const row of allData) {
            await Contest.upsert({
                name: row.name,
                startTime: row.startTime,
                duration: row.duration,
                PlatformId: platforms[row.platformName].id,
                ContestTypeId: types[row.typeName].id
            });
        }

        res.json({ message: 'Contests upserted', count: allData.length });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ error: 'Failed to update contests' });
    }
});

app.get('/api/contests', async (req, res) => {
    const contests = await Contest.findAll({
        include: [Platform, ContestType],
        order: [['startTime', 'ASC']]
    });
    res.json(contests);
});

async function createCalendarEvent(user, contest) {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event = {
        summary: contest.name,
        description: `${contest.name} - Programming Contest`,
        start: {
            dateTime: new Date(contest.startTime * 1000).toISOString(),
            timeZone: 'Asia/Kolkata'
        },
        end: {
            dateTime: new Date((contest.startTime + contest.duration) * 1000).toISOString(),
            timeZone: 'Asia/Kolkata'
        },
        reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 10 }]
        }
    };

    try {
        const res = await calendar.events.insert({
            calendarId: 'primary',
            resource: event
        });
        console.log('📅 Event created:', res.data.htmlLink); // This will show Google Calendar event link
        return res.data.id;
    } catch (err) {
        console.error('❌ Calendar insert failed:', err.response?.data || err.message);
        throw err;
    }
}
app.post('/api/add-to-calendar/:contestId', async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const contestId = req.params.contestId;

    try {
        const contest = await Contest.findByPk(contestId, { include: [Platform] });
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        const existing = await CalendarEvent.findOne({
            where: {
                UserId: req.user.id,
                ContestId: contest.id
            }
        });

        if (existing) {
            return res.json({ message: 'Contest already added to calendar.' });
        }

        const eventId = await createCalendarEvent(req.user, contest);
        await CalendarEvent.create({
            eventId,
            UserId: req.user.id,
            ContestId: contest.id
        });

        res.json({ message: 'Contest successfully added to calendar.' });
    } catch (err) {
        console.error('Calendar add error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// DANGER: Clears all calendar events from DB
app.get('/dev/clear-calendar-events', async (req, res) => {
    try {
        await CalendarEvent.destroy({ where: {} });
        res.send('🧹 All calendar event records cleared from DB.');
    } catch (err) {
        console.error('Failed to clear calendar events:', err);
        res.status(500).send('Failed to clear calendar events');
    }
});


// ----- 9) Email Reminders via Cron -----
// const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
// cron.schedule('* * * * *', async () => {
//     const nowSec = Math.floor(Date.now() / 1000);
//     const remSec = nowSec + 20 * 60;
//     const upcoming = await Contest.findAll({ where: { startTime: { [Op.between]: [remSec - 30, remSec + 30] } }, include: ContestType });

//     for (const contest of upcoming) {
//         const users = await contest.ContestType.getUsers();
//         for (const u of users) {
//             const mail = {
//                 from: process.env.EMAIL_USER,
//                 to: u.email,
//                 subject: `Reminder: ${contest.name} starts soon!`,
//                 text: `Hi ${u.name},\n\n${contest.name} starts at ${new Date(contest.startTime * 1000).toLocaleString()}.\n\nGood luck!`
//             };
//             try { await transporter.sendMail(mail); } catch (e) { console.error(`Email to ${u.email} failed:`, e); }
//             await new Promise(r => setTimeout(r, 1000));
//         }
//     }
// });



app.get('/test-send-emails', async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.findAll();  // Adjust model name if needed

        for (const u of users) {
            const mail = {
                from: process.env.EMAIL_USER,
                to: u.email,
                subject: 'Test Email from Contest Alert',
                text: `Hi ${u.name},\n\nThis is a simple test email. No contest info included.\n\nCheers!`,
            };

            try {
                await transporter.sendMail(mail);
                console.log(`Email sent to ${u.email}`);
            } catch (e) {
                console.error(`Failed to send email to ${u.email}`, e);
            }

            // Optional delay to avoid spam limits
            await new Promise(r => setTimeout(r, 500));
        }

        res.send('Test emails sent to all users!');
    } catch (err) {
        console.error('Error sending emails:', err);
        res.status(500).send('Failed to send emails');
    }
});



app.get('/manual-send-emails', async (req, res) => {
    try {
        // Get all users
        const users = await User.findAll(); // Ensure 'User' is properly imported

        for (const u of users) {
            const mail = {
                from: process.env.EMAIL_USER,
                to: u.email,
                subject: `Reminder: Leetcode Weekly Contest starts soon!`,
                text: `Hi ${u.name},\n\nLeetcode Weekly Contest starts at 1 June 8 p.m.\n\nGood luck!`
            };

            try {
                await transporter.sendMail(mail);
                console.log(`Manual reminder sent to ${u.email}`);
            } catch (e) {
                console.error(`Email to ${u.email} failed:`, e);
            }

            // Throttle emails to avoid Gmail rate limits
            await new Promise(r => setTimeout(r, 1000));
        }

        res.send('Manual reminders sent!');
    } catch (err) {
        console.error('Manual reminder sending failed:', err);
        res.status(500).send('Manual reminder sending failed');
    }
});


// ----- 10) Start Server -----
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
