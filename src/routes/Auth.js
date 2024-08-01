const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateLogin = require('../middleware/validateLogin');
const validateRegister = require('../middleware/validateRegister');
const { registerUser, loginUser, logoutUser, verifyPassword } = require('../controllers/authController');

//  @route POST /api/auth/register
//  @desc Register a new user
router.post('/register', validateRegister, registerUser);

// @route POST /api/auth/login
// @desc Authenticate user & retrieve token
router.post('/login', validateLogin, loginUser);

// @route POST /api/auth/logout
// @desc Logout a user
router.post('/logout', auth, logoutUser);

// @route   POST /api/auth/verify-password
// @desc    Verify current password
router.post('/verify-password', auth, verifyPassword);

module.exports = router;