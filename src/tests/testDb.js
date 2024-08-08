const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectTestDB = async () => {
    const TEST_DB_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/CryptoTraderTest';
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect(); // Disconnect any existing connection
        }
        console.log('TEST DATABASE URL: ', TEST_DB_URL);
        await mongoose.connect(TEST_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Test Database Connected');
    } catch (err) {
        console.error('Error connecting to Test Database URL: ', err.message);
        process.exit(1);
    }
};

module.exports = connectTestDB;