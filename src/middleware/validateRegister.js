const { validationResult } = require('express-validator');
const { validateEmail, validatePassword, validateFirstName, validateLastName, validateAllowedFields } = require('./validators');

// Register fields
const allowedFields = ['firstName', 'lastName', 'email', 'password'];

module.exports = validateLogin = [
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePassword,
    validateAllowedFields(allowedFields),
    (request, response, next) => {
        const errors = validationResult(request);
        if(!errors.isEmpty()) {
            // Log validation errors in server and return to client
            const errorMessages = errors.array().map(error => error.msg);
            console.log(`Invalid register request: \n\t\t\t${errorMessages.join(',\n\t\t\t')}`);
            return response.status(400).json({ msg:  errorMessages });
        }
        next();
    }
];