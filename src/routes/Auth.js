const express = require('express');
const router = express.Router();

//  @route POST /api/auth/register
//  @desc Register a new user
router.post('/register');

// @route POST /api/auth/login
// @desc Authenticate user & retrieve token
router.post('/login');

// @route POST /api/auth/logout
// @desc Logout a user
router.post('/logout');