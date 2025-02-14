const mongoose = require('mongoose');

const connectDB = async (databaseURL) => {
    await mongoose.connect(databaseURL);
}

module.exports = connectDB;