const User = require('../schemas/User');
const Contest = require('../schemas/Contest');
const CalendarEvent = require('../schemas/CalendarEvent');
const { createCalendarEvent } = require('../services/calendarService');

const handleGoogleCallback = async (req, res) => {
    try {
        const user = req.user;
        const populatedUser = await User.findById(user.id).populate('reminderPreferences');
        const prefs = populatedUser.reminderPreferences || [];
        
        if (!prefs.length) {
            return res.redirect(`${process.env.REACT_APP_FRONTEND_URL}`);
        }

        const now = Math.floor(Date.now() / 1000);
        const contests = await Contest.find({
            startTime: { $gt: now },
            ContestType: { $in: prefs.map(p => p._id) }
        }).populate('Platform');

        for (const contest of contests) {
            try {
                const existing = await CalendarEvent.findOne({
                    UserId: user.id,
                    ContestId: contest.id
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
            } catch (err) {
                console.error(`❌ Calendar error for ${contest.name}:`, err.message);
            }
            await new Promise(r => setTimeout(r, 500));
        }

        res.redirect(`${process.env.REACT_APP_FRONTEND_URL}`);
    } catch (err) {
        console.error('OAuth calendar insertion failed:', err);
        res.redirect('/login');
    }
};

const handleLogout = (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.json({ message: 'Signed out successfully.' });
        });
    });
};

module.exports = {
    handleGoogleCallback,
    handleLogout
};
