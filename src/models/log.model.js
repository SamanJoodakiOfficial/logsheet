const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    action: { type: String, enum: ["REGISTER", "LOGIN", "LOGOUT", "CREATE", "READ", "UPDATE", "DELETE"], required: true },
    module: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userIp: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Log', schema);