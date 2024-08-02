const { check, validationResult } = require('express-validator');
const { validateEmail, validatePassword, validateFirstName, validateLastName, validateAllowedFields, validateBalance } = require('./validators');

// User fields
const allowedFields = ['firstName', 'lastName', 'email', 'password', 'balance'];

module.exports = validateUserInfo = [
    // Run the validation only if the field is present
    ...validateFirstName.map(validation => validation.optional()),
    ...validateLastName.map(validation => validation.optional()),
    ...validateEmail.map(validation => validation.optional()),
    ...validatePassword.map(validation => validation.optional()),
    ...validateBalance.map(validation => validation.optional()),
    validateAllowedFields(allowedFields),  // Ensure only allowed fields are present
    (request, response, next) => {
        const errors = validationResult(request);
        if(!errors.isEmpty()) {
            // Log validation errors in server and return to client
            const errorMessages = errors.array().map(error => error.msg);
            console.log(`Invalid Update user info request: \n\t\t\t${errorMessages.join(',\n\t\t\t')}`);
            return response.status(400).json({ msg:  errorMessages });
        }
        next();
    }
];