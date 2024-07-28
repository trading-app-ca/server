const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User");



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


module.exports = {
    registerUser,
    loginUser
}