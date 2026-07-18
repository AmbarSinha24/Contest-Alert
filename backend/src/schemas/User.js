const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userSchema);
