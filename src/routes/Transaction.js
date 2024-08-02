const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTransactions } = require('../controllers/transactionController');

// @route GET /api/transactions
// @desc Retrieve all transactions for a user
router.get('/', auth, getTransactions);

module.exports = router;