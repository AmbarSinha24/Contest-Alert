require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const mongoose = require('mongoose');

// ----- 1) Initialize Mongoose Schema / Models -----
const platformSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const PlatformMongo = mongoose.model('Platform', platformSchema);

const contestTypeSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const ContestTypeMongo = mongoose.model('ContestType', contestTypeSchema);

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, required: true },
    name: { type: String },
    email: { type: String, unique: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    photo: { type: String },
    reminderPreferences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ContestType' }],
    created_at: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const UserMongo = mongoose.model('User', userSchema);

const contestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startTime: { type: Number, required: true },
    duration: { type: Number, required: true },
    Platform: { type: mongoose.Schema.Types.ObjectId, ref: 'Platform', required: true },
    ContestType: { type: mongoose.Schema.Types.ObjectId, ref: 'ContestType', required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
contestSchema.index({ Platform: 1, name: 1, startTime: 1 }, { unique: true });
const ContestMongo = mongoose.model('Contest', contestSchema);

const calendarEventSchema = new mongoose.Schema({
    eventId: { type: String, required: true },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ContestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const CalendarEventMongo = mongoose.model('CalendarEvent', calendarEventSchema);

// ----- 2) Initialize Sequelize (MySQL) -----
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
    }
);

// Define Sequelize Models
const UserSeq = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    googleId: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    accessToken: { type: DataTypes.TEXT },
    refreshToken: { type: DataTypes.TEXT },
    photo: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE }
}, { tableName: 'users', timestamps: false });

const PlatformSeq = sequelize.define('Platform', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING }
}, { tableName: 'platforms', timestamps: false });

const ContestTypeSeq = sequelize.define('ContestType', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING }
}, { tableName: 'contest_types', timestamps: false });

const ContestSeq = sequelize.define('Contest', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING },
    startTime: { type: DataTypes.INTEGER },
    duration: { type: DataTypes.INTEGER },
    PlatformId: { type: DataTypes.INTEGER },
    ContestTypeId: { type: DataTypes.INTEGER }
}, { tableName: 'contests', timestamps: false });

const CalendarEventSeq = sequelize.define('CalendarEvent', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    eventId: { type: DataTypes.STRING },
    UserId: { type: DataTypes.INTEGER },
    ContestId: { type: DataTypes.INTEGER }
}, { tableName: 'calendar_events', timestamps: false });

const ReminderPreferenceSeq = sequelize.define('ReminderPreference', {
    UserId: { type: DataTypes.INTEGER },
    ContestTypeId: { type: DataTypes.INTEGER }
}, { tableName: 'reminder_preferences', timestamps: false });

async function migrate() {
    console.log('🔄 Starting Database Migration...');

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
        throw new Error('❌ MONGODB_URI is not set in env variables');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB Atlas');

    // Authenticate SQL
    await sequelize.authenticate();
    console.log('🔗 Connected to MySQL');

    // Clear target Mongo collections to avoid duplicate key errors on clean migrations
    console.log('🧹 Clearing existing collections in MongoDB...');
    await PlatformMongo.deleteMany({});
    await ContestTypeMongo.deleteMany({});
    await UserMongo.deleteMany({});
    await ContestMongo.deleteMany({});
    await CalendarEventMongo.deleteMany({});
    console.log('🧹 MongoDB collections cleared.');

    // 1) Migrate Platforms
    const platforms = await PlatformSeq.findAll({ raw: true });
    console.log(`📋 Found ${platforms.length} Platforms in MySQL`);
    const platformIdMap = {};
    for (const p of platforms) {
        const mongoPlatform = await PlatformMongo.create({ name: p.name });
        platformIdMap[p.id] = mongoPlatform._id;
    }
    console.log('✅ Platforms migrated');

    // 2) Migrate ContestTypes
    const contestTypes = await ContestTypeSeq.findAll({ raw: true });
    console.log(`📋 Found ${contestTypes.length} Contest Types in MySQL`);
    const contestTypeIdMap = {};
    for (const ct of contestTypes) {
        const mongoType = await ContestTypeMongo.create({ name: ct.name });
        contestTypeIdMap[ct.id] = mongoType._id;
    }
    console.log('✅ Contest Types migrated');

    // 3) Fetch User Reminder Preferences Map
    const reminderPrefs = await ReminderPreferenceSeq.findAll({ raw: true });
    const userPrefsMap = {};
    for (const rp of reminderPrefs) {
        if (!userPrefsMap[rp.UserId]) {
            userPrefsMap[rp.UserId] = [];
        }
        const mongoTypeId = contestTypeIdMap[rp.ContestTypeId];
        if (mongoTypeId) {
            userPrefsMap[rp.UserId].push(mongoTypeId);
        }
    }

    // 4) Migrate Users
    const users = await UserSeq.findAll({ raw: true });
    console.log(`📋 Found ${users.length} Users in MySQL`);
    const userIdMap = {};
    for (const u of users) {
        const prefs = userPrefsMap[u.id] || [];
        const mongoUser = await UserMongo.create({
            googleId: u.googleId,
            name: u.name,
            email: u.email,
            accessToken: u.accessToken,
            refreshToken: u.refreshToken,
            photo: u.photo,
            reminderPreferences: prefs,
            created_at: u.created_at || new Date()
        });
        userIdMap[u.id] = mongoUser._id;
    }
    console.log('✅ Users migrated');

    // 5) Migrate Contests
    const contests = await ContestSeq.findAll({ raw: true });
    console.log(`📋 Found ${contests.length} Contests in MySQL`);
    const contestIdMap = {};
    for (const c of contests) {
        const platformId = platformIdMap[c.PlatformId];
        const contestTypeId = contestTypeIdMap[c.ContestTypeId];

        if (!platformId || !contestTypeId) {
            console.warn(`⚠️ Skipping contest "${c.name}" because platform/type reference was missing`);
            continue;
        }

        try {
            const mongoContest = await ContestMongo.create({
                name: c.name,
                startTime: c.startTime,
                duration: c.duration,
                Platform: platformId,
                ContestType: contestTypeId
            });
            contestIdMap[c.id] = mongoContest._id;
        } catch (err) {
            console.error(`❌ Failed to migrate contest "${c.name}":`, err.message);
        }
    }
    console.log('✅ Contests migrated');

    // 6) Migrate CalendarEvents
    const events = await CalendarEventSeq.findAll({ raw: true });
    console.log(`📋 Found ${events.length} Calendar Events in MySQL`);
    let eventCount = 0;
    for (const ev of events) {
        const userId = userIdMap[ev.UserId];
        const contestId = contestIdMap[ev.ContestId];

        if (!userId || !contestId) {
            console.warn(`⚠️ Skipping calendar event (ID: ${ev.id}) because user/contest mapping was missing`);
            continue;
        }

        await CalendarEventMongo.create({
            eventId: ev.eventId,
            UserId: userId,
            ContestId: contestId
        });
        eventCount++;
    }
    console.log(`✅ ${eventCount} Calendar Events migrated`);

    console.log('🎉 Database migration completed successfully!');
}

migrate()
    .then(() => {
        sequelize.close();
        mongoose.connection.close();
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Migration failed with error:', err);
        process.exit(1);
    });
