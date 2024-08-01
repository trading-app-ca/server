const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const RevokedToken = require('../models/RevokedToken');

const revokeToken = async (token) => {
    try {
        // Log token being revoked to server console
        console.log('Revoking token:', token);

        // Decode JWT token
        const decodedToken = jwt.decode(token);

        // Check if token is not valid
        if (!decodedToken) {
            throw new Error('Invalid token');
        }

        // Set expiry time to current time
        const expiryTime = Date.now();
        console.log(`time now: ${Date.now()}`,'Token expiry time in ms:', expiryTime);

        // Create new revoked token with token received
        const revokedToken = new RevokedToken({ token: token, revokedAt:  expiryTime});
        await revokedToken.save();

        console.log('Token revoked successfully');
        return { msg: 'Token revoked succesfully'};

    } catch (error) {
        // Log caught error to server console and return server error to client
        return { msg: `Error during token revocation: ` + error.message };
    }
};

const registerUser = async (request, response) => {
    // Log user details to server console
    console.log('Registering new user:', `Request Body: ${JSON.stringify(request.body)}`);

    // Retrive user info
    const { firstName, lastName, email, password } = request.body;

    // Check for missing user info fields
    if(!firstName || !lastName || !email || !password) {
        console.log('msg: All user info fields required');
        return response.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // Check if email address allready in use
        let user = await User.findOne({ email });
        if(user) {
            console.log('User allready exists');
            return response.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            firstName,
            lastName,
            email,
            password
        });

        // Generate salt and log to server console
        const salt = await bcrypt.genSalt(10);
        console.log('Salt Generated:', salt); 

        // Salt users password using bcrypt and log to server console
        user.password = await bcrypt.hash(password, salt);
        console.log('Hashed Password:', user.password);

        // Save user info
        await user.save();

        // Create portfolio for user
        // await createPortfolio(user.id);      // NEEDS TO BE IMPLIMENTED

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (error, token) => {
                if(error) {
                    console.log(`Server error: ${error}`);
                    throw error;
                };
                console.log('JWT token:', token);
                response.json({ token });
            }
        );
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
};



const loginUser = async (request, response) => {
    // Log user details to server console
    console.log('Logging in user:', `Request Body: ${JSON.stringify(request.body)}`);

    const invalidCredentials = async(serverMessage) => {
        console.log(serverMessage);
        return response.status(400).json({ msg: 'Invalid login credentials' });
    };

    // Retreive user info from JSON body
    const { email, password } = request.body;

    try {
        // Check user exists in database
        let user = await User.findOne({ email });
        if (!user) {
            return invalidCredentials(`Invalid login credentials: user not found '${email}'`);
        }

        // Validate the password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return invalidCredentials('Invalid login credentials: incorrect password');
        }

        // Generate JWT for valid credentials
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (error, token) => {
                if(error) {
                    console.log(`Server error: ${error}`);
                    throw error;
                }
                console.log('JWT token:', token);
                response.json({ token });
            }
        );

    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error', error.message);
        return response.status(500).send('Server error');
    }
};


const logoutUser = async(request, response) => {
    try {
        // Assign token from request to token variable
        const token = request.token;

        // Revoke token
        const revocationResult = await revokeToken(token);

        // Respond to client
        if (revocationResult.msg.startsWith('Error')) {
            console.error(revocationResult.msg);
            return response.status(500).json({ msg: 'Server error'});
        }
        response.json({ msg: 'User logged out successfully' });
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.log('Error', error.message);
        return response.status(500).send('Server error');
    }
};


const verifyPassword = async(request, response) => {
    try {

        // Assign user object from request to user variable
        let user = request.user;

        // Retrieve password to verify from request body
        const { password: passwordToVerify } = request.body;

        // User not found log to server console and send response to client
        if (!user) {
            console.log('User not found');
            return response.status(404).json({ msg: 'User not found' });
        }

        // Verify password against user
        const passwordVerified = await bcrypt.compare(passwordToVerify, user.password);

        // Incorrect password log to server console and send response to client
        if (!passwordVerified) {
            console.log('Incorrect password');
            return response.status(400).json({ msg: 'Incorrect password'});
        }

        // Password verified log to server console and send response to client
        console.log('Password verified');
        response.json({ msg: "Verified" });
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error(error.message);
        response.status(500).send('Server error');
    }
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    verifyPassword
}