const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    eventId: { type: String, required: true },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ContestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
