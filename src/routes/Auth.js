const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { registerUser, loginUser } = require('../controllers/authController');

//  @route POST /api/auth/register
//  @desc Register a new user
router.post('/register', registerUser);

// @route POST /api/auth/login
// @desc Authenticate user & retrieve token
router.post('/login', loginUser);

// @route POST /api/auth/logout
// @desc Logout a user
router.post('/logout', auth);

module.exports = router;