const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route GET /api/transactions
// @desc Retrieve all transactions for a user
router.get('/', auth);

module.exports = router;