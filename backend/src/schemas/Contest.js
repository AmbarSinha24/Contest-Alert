const mongoose = require('mongoose');

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

module.exports = mongoose.model('Contest', contestSchema);
