const express = require('express');
const router = express.router();

// @route GET /api/trades
// @desc Retrieves all trades for a user
router.get('/');

// @route POST /api/trades/new-trade
// @desc Place a new 'buy' or 'sell' order
router.post('/new-trade');

module.exports = router;