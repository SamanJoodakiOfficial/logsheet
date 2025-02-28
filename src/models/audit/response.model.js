const mongoose = require('mongoose');


const answerSchema = new mongoose.Schema({
    answer: { type: Number, required: true },
    delayTime: { type: Number, required: true }
}, { timestamps: true });

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
    answers: [answerSchema],
}, { timestamps: true });

module.exports = mongoose.model('Response', schema);