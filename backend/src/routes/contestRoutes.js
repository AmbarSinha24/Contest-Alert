const express = require('express');
const {
    updateContests,
    getContests,
    addToCalendar,
    clearCalendarEvents,
    sendTestEmails,
    sendManualEmails
} = require('../controllers/contestController');

const router = express.Router();

router.get('/api/contests', getContests);
router.post('/api/updateContests', updateContests);
router.post('/api/add-to-calendar/:contestId', addToCalendar);

// Utility developer tools routes — these loop over every user sending real
// emails or deleting data, and were reachable by anyone with zero auth.
// Restrict to non-production so they can't be hit repeatedly in the wild.
const devOnly = (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).end();
    }
    next();
};

router.get('/dev/clear-calendar-events', devOnly, clearCalendarEvents);
router.get('/test-send-emails', devOnly, sendTestEmails);
router.get('/manual-send-emails', devOnly, sendManualEmails);

module.exports = router;
