const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPortfolio } = require('../controllers/portfolioController');

// @route GET /api/portfolio
// @desc Retrieve users portfolio
router.get('/', auth, getPortfolio);

module.exports = router;