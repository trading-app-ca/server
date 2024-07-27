const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route GET /api/user
// @desc Retrieve user info
router.get('/', auth);

// @route PUT /api/user
// @desc Update user info
router.put('/', auth);

// @route DELETE /api/user
// @desc Removes user and user related fields from database
router.delete('/', auth);

module.exports = router;