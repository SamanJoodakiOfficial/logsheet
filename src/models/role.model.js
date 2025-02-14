const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String },
    permissions: [{
        module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
        access: {
            read: { type: Boolean, default: false },
            write: { type: Boolean, default: false },
            update: { type: Boolean, default: false },
            delete: { type: Boolean, default: false },
            admin: { type: Boolean, default: false }
        },
    }]
}, { timestamps: true });

module.exports = mongoose.model('Role', schema);