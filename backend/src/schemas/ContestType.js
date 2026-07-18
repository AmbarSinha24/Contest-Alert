const mongoose = require('mongoose');

const contestTypeSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('ContestType', contestTypeSchema);
