const express = require('express');
const router = express.Router();

// @route GET /api/user
// @desc Retrieve user info
router.get('/');

// @route PUT /api/user
// @desc Update user info
router.put('/');

// @route DELETE /api/user
// @desc Removes user and user related fields from database
router.delete('/');

module.exports = router;