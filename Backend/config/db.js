const mongoose = require('mongoose');

require('dotenv').config();

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to the database');
    } catch (err) {
        console.error(`Error connecting to the database: ${err.message}`);
        console.error('Full error:', err);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
