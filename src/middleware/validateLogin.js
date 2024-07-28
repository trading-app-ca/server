const { check, validationResult } = require('express-validator');

module.exports = validateLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    check('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .custom(value => {
            // Check that the password is not just blank spaces
            if (value.trim().length === 0) {
                throw new Error('Password cannot be blank spaces');
            }
            return true;
        }),
    (request, response, next) => {
        const errors = validationResult(request);
        if(!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array().map(error => error.msg) });
        }
        next();
    }
];