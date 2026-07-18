const { google } = require('googleapis');

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
        console.log('📅 Event created:', res.data.htmlLink);
        return res.data.id;
    } catch (err) {
        console.error('❌ Calendar insert failed:', err.response?.data || err.message);
        throw err;
    }
}

module.exports = {
    createCalendarEvent
};
