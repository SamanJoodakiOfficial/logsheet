const mongoose = require('mongoose');

const schema = mongoose.Schema({
    text: { type: String, required: true },
    weight: { type: Number, default: 0 },
    options: [{
        text: { type: String },
        weight: { type: Number }
    }],
    type: {
        type: String,
        enum: ["numeric", "multiple-choice", "yes-no", "descriptive"],
        required: true,
    },
    allowedDocuments: [{
        type: String,
        enum: ["pdf", "doc", "docx", "xls", "xlsx", "txt", "jpg", "jpeg", "png", "gif", "bmp"]
    }],
    checklist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checklist'
    },
    responses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Response'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Question', schema);
