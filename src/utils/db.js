const mongoose = require('mongoose');
const dotenv = require('dotenv');

const DB_URL = process.env.DATABASE_URL;

dotenv.config();

const connectDB = async () => {
    try {
        console.log('DATABASE URL: ', DB_URL);
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database Connected');
    } catch (err) {
        console.error('Error connecting to Database URL: ', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;