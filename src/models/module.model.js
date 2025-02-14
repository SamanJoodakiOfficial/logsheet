const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Module', schema);