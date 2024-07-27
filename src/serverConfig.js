const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const express = require('express');
const connectDB = require('./utils/db');

const app = express();

// Connect to the Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());    // Enable CORS for all routes

// Define Routes
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/user', require('./routes/User'));
app.use('/api/portfolio', require('./routes/Portfolio'));
app.use('/api/transactions', require('./routes/Transaction'));
app.use('/api/trades', require('./routes/Trade'));

// Server Health check route
app.get('/health', (request, response) => {
    response.status(200).send('OK');
});

module.exports = app;
