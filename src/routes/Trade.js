const express = require('express');
const router = express.router();
const auth = require('../middleware/auth');

// @route GET /api/trades
// @desc Retrieves all trades for a user
router.get('/', auth);

// @route POST /api/trades/new-trade
// @desc Place a new 'buy' or 'sell' order
router.post('/new-trade', auth);

module.exports = router;