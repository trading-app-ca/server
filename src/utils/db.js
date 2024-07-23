const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DB_URL = process.env.DATABASE_URL;

const connectDB = async () => {
    try {
        console.log('DATABASE URL: ', DB_URL);
        await mongoose.connect(DB_URL || process.env.DATABASE_URL);
        console.log('Database Connected');
    } catch (err) {
        console.error('Error connecting to Database URL: ', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;