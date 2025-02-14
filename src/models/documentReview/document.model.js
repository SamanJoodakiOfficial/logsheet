const mongoose = require('mongoose');

const schema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    name: {
        type: String
    },
    path: {
        type: String
    },
    fileId: {
        type: String
    },
    analysisResult1: {
        type: [Object],  // تغییر از String به Array از اشیاء
    },
    analysisResult2: {
        type: [Object],  // تغییر از String به Array از اشیاء
    },
    analysisResult3: {
        type: [Object],  // تغییر از String به Array از اشیاء
    },
}, { timestamps: true });

module.exports = mongoose.model('Document', schema);
