const { validationResult } = require('express-validator');
const { validateAllowedFields, validateQuantity, validateType, validatePrice, validateAssetName } = require('./validators');

//  fields
const allowedFields = [ 'type', 'assetName', 'quantity', 'price'];

module.exports = validateTrade = [
    validateType,
    validateAssetName,
    validateQuantity,
    validatePrice,
    validateAllowedFields(allowedFields),
    (request, response, next) => {
        const errors = validationResult(request);
        if(!errors.isEmpty()) {
            // Log validation errors in server and return to client
            const errorMessages = errors.array().map(error => error.msg);
            console.log(`Invalid Trade request: \n\t\t\t${errorMessages.join(',\n\t\t\t')}`);
            return response.status(400).json({ msg:  errorMessages });
        }
        next();
    }
]