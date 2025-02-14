const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    audit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuditCourse',
        required: true
    },
    checklist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checklist',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    answers: [{
        answer: { type: Number, required: true },
        delayTime: { type: Number, required: true } // in milliseconds or seconds
    }],
}, { timestamps: true });

module.exports = mongoose.model('Response', schema);