const { body, validationResult } = require('express-validator');
const { validateEmail, validatePassword } = require('./validators');

// Login fields
const allowedFields = ['email', 'password'];

module.exports = validateLogin = [
    validateEmail,
    validatePassword,
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