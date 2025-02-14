const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    logTimes: [{
        type: Date
    }],
    access: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        checklists: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Checklist'
        }]
    }],
    checklists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checklist'
    }]
}, { timestamps: true });

module.exports = mongoose.model('AuditCourse', schema);