const { validationResult } = require('express-validator');
const { validateEmail, validatePassword, validateAllowedFields } = require('./validators');

// Login fields
const allowedFields = ['email', 'password'];

module.exports = validateLogin = [
    validateEmail,
    validatePassword,
    validateAllowedFields(allowedFields),
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