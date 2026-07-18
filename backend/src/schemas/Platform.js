const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Platform', platformSchema);
