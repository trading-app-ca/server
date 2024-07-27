const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route GET /api/portfolio
// @desc Retrieve users portfolio
router.get('/', auth);

// @route PUT /api/portfolio
// @desc Update a users portfolio
router.put('/', auth);

module.exports = router;