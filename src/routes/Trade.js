const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateTrade = require('../middleware/validateTrade');
const { getTrades, placeTrade } = require('../controllers/tradeController');

// @route GET /api/trades
// @desc Retrieves all trades for a user
router.get('/', auth, getTrades);

// @route POST /api/trades/new-trade
// @desc Place a new 'buy' or 'sell' order
router.post('/new-trade', auth, validateTrade, placeTrade);

module.exports = router;