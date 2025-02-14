const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Org', required: true },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    parentNode: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    childrenNodes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    }],
    hierarchyPath: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
}, { timestamps: true });

module.exports = mongoose.model('Group', schema);