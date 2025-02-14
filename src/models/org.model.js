const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String },
    economicCode: { type: String },
    address: { type: String },
    telephone: { type: String },
    type: { type: String, enum: ['private', 'public', 'government'], default: 'private' },
    modules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Org', schema);