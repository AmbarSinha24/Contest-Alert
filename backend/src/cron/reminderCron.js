const cron = require('node-cron');
const Contest = require('../schemas/Contest');
const User = require('../schemas/User');
const { sendEmail } = require('../services/emailService');

const startReminderCron = () => {
    // Check every minute
    cron.schedule('* * * * *', async () => {
        const nowSec = Math.floor(Date.now() / 1000);
        const remSec = nowSec + 20 * 60; // 20 minutes in the future
        
        try {
            const upcoming = await Contest.find({
                startTime: { $gte: remSec - 30, $lte: remSec + 30 }
            }).populate('ContestType');

            for (const contest of upcoming) {
                if (!contest.ContestType) continue;

                const users = await User.find({ reminderPreferences: contest.ContestType._id });
                for (const u of users) {
                    const subject = `Reminder: ${contest.name} starts soon!`;
                    const text = `Hi ${u.name},\n\n${contest.name} starts at ${new Date(contest.startTime * 1000).toLocaleString()}.\n\nGood luck!`;
                    
                    try {
                        await sendEmail({ to: u.email, subject, text });
                        console.log(`✉️ Email reminder sent to ${u.email} for ${contest.name}`);
                    } catch (e) {
                        console.error(`Email to ${u.email} failed:`, e.message);
                    }
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        } catch (err) {
            console.error('Cron reminder error:', err);
        }
    });
};

module.exports = startReminderCron;
