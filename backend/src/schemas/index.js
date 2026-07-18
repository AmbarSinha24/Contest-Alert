const Platform = require('./Platform');
const ContestType = require('./ContestType');
const User = require('./User');
const Contest = require('./Contest');
const CalendarEvent = require('./CalendarEvent');

const FIXED_TYPES = {
    Weekly: 1,
    Biweekly: 2,
    Div1: 3,
    Div2: 4,
    Div3: 5,
    Div4: 6,
    Other: 7
};

async function seedContestTypes() {
    try {
        for (const name of Object.keys(FIXED_TYPES)) {
            await ContestType.findOneAndUpdate({ name }, { name }, { upsert: true, new: true });
        }
        console.log('✅ contest_types seeded');
    } catch (err) {
        console.error('Error seeding contest_types:', err);
    }
}

module.exports = {
    Platform,
    ContestType,
    User,
    Contest,
    CalendarEvent,
    seedContestTypes
};
