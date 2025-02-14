const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    indicators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Indicator" }],
}, { timestamps: true });

module.exports = mongoose.model('Category', schema);