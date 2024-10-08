const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Trade = require('../models/Trade');
const Transaction = require('../models/Transaction');
const { revokeToken } = require('./authController');

const getUserInfo = async(request, response) => {
    try {
        console.log('Retreiving user info');

        // Assign user object from request to user variable
        const user = request.user;

        // Check user exists
        if (!user) {
            console.log('User not found');
            return response.status(404).json({ msg: 'User not found' });
        }

        // log success response to server log and return user info to client 
        console.log('Returning user info')
        response.json(user);
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
};


const updateUserInfo = async(request, response) => {
    try {
        console.log('Updating user info');

        // Assign user object from request to user variable
        const user = request.user;

        // Check user exists
        if (!user) {
            console.log('User not found');
            return response.status(404).json({ msg: 'User not found' });
        }

        // Retrieve user info from request body
        const { firstName, lastName, email, password, balance } = request.body;

        // Update user fields if sent in request body
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.balance = balance || user.balance;
    
        // Update password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            // Save user object
            await user.save();

            // Revoke old token
            const oldToken = request.token;
            await revokeToken(oldToken);

            // Issue new token
            const payload = {
                user: {
                    id: user.id,
                },
            };

            // Sign the new JWT token
            request.token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 });
        } else {
            // Save user object
            await user.save();
        }

        // Set token to request token
        const token = request.token;

        // log success response to server log and return updated user info and token to client
        console.log('User info updates successfuly')
        response.json({user, token});

    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
};


const deleteUser = async(request, response) => {
    try {
        console.log('Deleting user');

        // Assign user object from request to user variable
        const userId = request.user.id;

        // Check user exists
        if (!userId) {
            console.log('User not found');
            return response.status(404).json({ msg: 'User not found' });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);
        console.log('Successfully deleted the user')

        // Delete the user's portfolio
        await Portfolio.findOneAndDelete({ user: userId });
        console.log('Successfully deleted the portfolio')

        // Delete the user's trades
        await Trade.deleteMany({ user: userId });
        console.log('Successfully deleted the trades')

        // Delete the user's transactions
        await Transaction.deleteMany({ user: userId });

        // return succesful response to server and client
        console.log('Successfully deleted the transactions')
        response.json({ msg: 'User and associated data deleted successfully' });

    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
};


const depositFunds = async(request, response) => {
    try{
        console.log('Depositing funds');
        // Retrieve amount to deposit from request body
        const { amount } = request.body;

        // Assign user variable to user object in request
        const user = request.user;

        // Create new transaction
        const newTransaction = new Transaction({
            user: user.id,
            type: 'Deposit',
            amount
        });
        
        // Set new user balance
        user.balance += amount;
        
        // Save newTransaction and user object changes to database
        await newTransaction.save();
        await user.save();

        // return succesful response to server and client
        console.log(`Successfully, deposited $${amount}`);
        response.json({ msg: `Successfully, deposited $${amount}`});
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
};


const withdrawFunds = async(request, response) => {
    try{
        console.log('Withdrawing funds');
        // Retrieve amount to withdraw from request body
        const { amount } = request.body;

        // Assign user variable to user object in request
        const user = request.user;

        // Create new transaction
        const newTransaction = new Transaction({
            user: user.id,
            type: 'Withdraw',
            amount
        });
        
        // Set new user balance
        user.balance -= amount;

        // Check balance is greater then zero
        if (user.balance < 0) {
            console.log('Insufficient funds');
            return response.status(400).json({ msg: 'Insufficient funds' });
        }
        
        // Save newTransaction and user object changes to database
        await newTransaction.save();
        await user.save();

        // return succesful response to server and client
        console.log(`Successfully, withdrew $${amount}`);
        response.json({ msg: `Successfully, withdrew $${amount}`});
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
};

module.exports = {
    getUserInfo,
    updateUserInfo,
    deleteUser,
    depositFunds,
    withdrawFunds,
}