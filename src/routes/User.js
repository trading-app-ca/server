const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserInfo, updateUserInfo, deleteUser } = require('../controllers/userController');
const validateUserInfo = require('../middleware/validateUpdateUserInfo');

// @route GET /api/user
// @desc Retrieve user info
router.get('/', auth, getUserInfo);

// @route PUT /api/user
// @desc Update user info
router.put('/', auth, validateUserInfo, updateUserInfo);

// @route DELETE /api/user
// @desc Removes user and user related fields from database
router.delete('/', auth, deleteUser);

module.exports = router;