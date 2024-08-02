const { validationResult } = require('express-validator');
const { validateAllowedFields, validateAmount } = require('./validators');

//  fields
const allowedFields = ['amount'];

module.exports = validateFundsAmount = [
    validateAmount,
    validateAllowedFields(allowedFields),  // Ensure only allowed fields are present
    (request, response, next) => {
        const errors = validationResult(request);
        if(!errors.isEmpty()) {
            // Log validation errors in server and return to client
            const errorMessages = errors.array().map(error => error.msg);
            console.log(`Invalid Transaction request: \n\t\t\t${errorMessages.join(',\n\t\t\t')}`);
            return response.status(400).json({ msg:  errorMessages });
        }
        next();
    }
];