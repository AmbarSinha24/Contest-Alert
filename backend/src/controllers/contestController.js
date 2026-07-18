const { Contest, Platform, ContestType, CalendarEvent, User } = require('../schemas');
const { fetchAllContests } = require('../services/scrapers');
const { createCalendarEvent } = require('../services/calendarService');
const { sendEmail } = require('../services/emailService');

const updateContests = async (req, res) => {
    try {
        const now = Math.floor(Date.now() / 1000);
        // Clear past contests (more than 1 hour old), along with any calendar
        // event records that reference them, so they don't orphan in the DB.
        const elapsed = await Contest.find({ startTime: { $lt: now - 3600 } }, '_id');
        if (elapsed.length) {
            const elapsedIds = elapsed.map(c => c._id);
            await CalendarEvent.deleteMany({ ContestId: { $in: elapsedIds } });
            await Contest.deleteMany({ _id: { $in: elapsedIds } });
        }

        const allData = await fetchAllContests();

        const platforms = {};
        const types = {};

        for (const row of allData) {
            if (!platforms[row.platformName]) {
                let plat = await Platform.findOne({ name: row.platformName });
                if (!plat) {
                    plat = await Platform.create({ name: row.platformName });
                }
                platforms[row.platformName] = plat;
            }
            if (!types[row.typeName]) {
                let typeDoc = await ContestType.findOne({ name: row.typeName });
                if (!typeDoc) {
                    typeDoc = await ContestType.create({ name: row.typeName });
                }
                types[row.typeName] = typeDoc;
            }
        }

        for (const row of allData) {
            await Contest.findOneAndUpdate(
                {
                    Platform: platforms[row.platformName]._id,
                    name: row.name,
                    startTime: row.startTime
                },
                {
                    duration: row.duration,
                    ContestType: types[row.typeName]._id
                },
                { upsert: true, new: true }
            );
        }

        res.json({ message: 'Contests upserted', count: allData.length });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ error: 'Failed to update contests' });
    }
};

const getContests = async (req, res) => {
    try {
        const contests = await Contest.find()
            .populate('Platform')
            .populate('ContestType')
            .sort({ startTime: 1 });
        res.json(contests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch contests' });
    }
};

const addToCalendar = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const contestId = req.params.contestId;

    try {
        const contest = await Contest.findById(contestId).populate('Platform');
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        const existing = await CalendarEvent.findOne({
            UserId: req.user.id,
            ContestId: contest.id
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
};

const clearCalendarEvents = async (req, res) => {
    try {
        await CalendarEvent.deleteMany({});
        res.send('🧹 All calendar event records cleared from DB.');
    } catch (err) {
        console.error('Failed to clear calendar events:', err);
        res.status(500).send('Failed to clear calendar events');
    }
};

const sendTestEmails = async (req, res) => {
    try {
        const users = await User.find();

        for (const u of users) {
            const subject = 'Test Email from Contest Alert';
            const text = `Hi ${u.name},\n\nThis is a simple test email. No contest info included.\n\nCheers!`;

            try {
                await sendEmail({ to: u.email, subject, text });
                console.log(`Email sent to ${u.email}`);
            } catch (e) {
                console.error(`Failed to send email to ${u.email}`, e.message);
            }

            await new Promise(r => setTimeout(r, 500));
        }

        res.send('Test emails sent to all users!');
    } catch (err) {
        console.error('Error sending emails:', err);
        res.status(500).send('Failed to send emails');
    }
};

const sendManualEmails = async (req, res) => {
    try {
        const users = await User.find();

        for (const u of users) {
            const subject = `Reminder: Leetcode Weekly Contest starts soon!`;
            const text = `Hi ${u.name},\n\nLeetcode Weekly Contest starts at 1 June 8 p.m.\n\nGood luck!`;

            try {
                await sendEmail({ to: u.email, subject, text });
                console.log(`Manual reminder sent to ${u.email}`);
            } catch (e) {
                console.error(`Email to ${u.email} failed:`, e.message);
            }

            await new Promise(r => setTimeout(r, 1000));
        }

        res.send('Manual reminders sent!');
    } catch (err) {
        console.error('Manual reminder sending failed:', err);
        res.status(500).send('Manual reminder sending failed');
    }
};

module.exports = {
    updateContests,
    getContests,
    addToCalendar,
    clearCalendarEvents,
    sendTestEmails,
    sendManualEmails
};
