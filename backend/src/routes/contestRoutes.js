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

// Utility developer tools routes
router.get('/dev/clear-calendar-events', clearCalendarEvents);
router.get('/test-send-emails', sendTestEmails);
router.get('/manual-send-emails', sendManualEmails);

module.exports = router;
