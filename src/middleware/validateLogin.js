const { check, body, validationResult } = require('express-validator');

// Login fields
const allowedFields = ['email', 'password'];

module.exports = validateLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    check('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .custom(value => {
            // Check that the password is not just blank spaces
            if (value?.trim().length === 0) {
                throw new Error('Password cannot be blank spaces');
            }
            return true;
        }),
    body().custom(body => {
        const extraFields = Object.keys(body).filter(field => !allowedFields.includes(field));
        if (extraFields.length > 0) {
            throw new Error(`Extra fields are not allowed: ${extraFields.join(', ')}`);
        }
        return true;
    }),
    (request, response, next) => {
        const errors = validationResult(request);
        if(!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            console.log(`Invalid login request: \n\t\t\t${errorMessages.join(',\n\t\t\t')}`);
            return response.status(400).json({ msg:  errorMessages });
        }
        next();
    }
];