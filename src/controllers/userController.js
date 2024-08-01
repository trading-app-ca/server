const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RevokedToken = require('../models/RevokedToken');
const { revokeToken } = require('./authController');

const getUserInfo = async(request, response) => {
    try {
        console.log('Retreiving user info');

        // Assign user object from request to user variable
        const user = request.user;

        if (!user) {
            console.log('User not found');
            return response.status(404).json({ msg: 'User not found' });
        }

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

            request.token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 });
        } else {
            // Save user object
            await user.save();
        }

        // log success response to server log and return updated user info to client
        console.log('User info updates successfuly')

        const token = request.token;
        response.json({user, token});

    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
}

module.exports = {
    getUserInfo,
    updateUserInfo,
}