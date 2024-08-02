const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserInfo, updateUserInfo, deleteUser, depositFunds, withdrawFunds } = require('../controllers/userController');
const validateUserInfo = require('../middleware/validateUpdateUserInfo');
const validateFundsAmount = require('../middleware/validateFundsAmount');

// @route GET /api/user
// @desc Retrieve user info
router.get('/', auth, getUserInfo);

// @route PUT /api/user
// @desc Update user info
router.put('/', auth, validateUserInfo, updateUserInfo);

// @route DELETE /api/user
// @desc Removes user and user related fields from database
router.delete('/', auth, deleteUser);

// @route   POST /api/user/deposit
// @desc    Deposit funds
router.post('/deposit', auth, validateFundsAmount, depositFunds);

// @route   POST /api/user/withdraw
// @desc    Withdraw funds
router.post('/withdraw', auth, validateFundsAmount, withdrawFunds);

module.exports = router;