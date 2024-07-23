const express = require('express');
const dotenv = require('dotenv');
const CORS = require('cors');
const connectDB = require('./utils/db');

const app = express();

// Connect to the Database
connectDB();

dotenv.config();
app.use(CORS());    // Enable CORS for all routes

module.exports = app;
