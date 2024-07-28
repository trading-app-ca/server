const { check, body, validationResult } = require('express-validator');

// Login fields
const allowedFields = ['email', 'password'];

module.exports = validateLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password')
        // Check password field exists
        .exists().withMessage('Password is required')
        
        // Stop running validations if the password does not exist
        .bail()

        // Check length of password
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        
        // Check password is not blank spaces
        .custom(value => {
            // Check that the password is not just blank spaces
            if (value?.trim().length === 0) {
                throw new Error('Password cannot be blank spaces');
            }
            return true;
        }),

    // Check Body does not contain extra fields
    body().custom(body => {
        const extraFields = Object.keys(body).filter(field => !allowedFields.includes(field));
        if (extraFields.length > 0) {
            // Log extra fields to server console and return to client
            throw new Error(`Extra fields are not allowed: ${extraFields.join(', ')}`);
        }
        return true;
    }),
    (request, response, next) => {
        const errors = validationResult(request);
        if(!errors.isEmpty()) {
            // Log validation errors in server and return to client
            const errorMessages = errors.array().map(error => error.msg);
            console.log(`Invalid login request: \n\t\t\t${errorMessages.join(',\n\t\t\t')}`);
            return response.status(400).json({ msg:  errorMessages });
        }
        next();
    }
];