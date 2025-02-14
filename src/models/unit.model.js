const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Org' },
    parentUnit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    roles: [{
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
}, { timestamps: true });

module.exports = mongoose.model('Unit', schema);