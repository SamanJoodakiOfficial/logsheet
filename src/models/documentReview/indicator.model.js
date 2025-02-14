const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    value: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['structural', 'content']
    }
}, { timestamps: true });

module.exports = mongoose.model('Indicator', schema);
