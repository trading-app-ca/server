const { body, check } = require('express-validator');

const validateFirstName = [
    check('firstName')
        .exists().withMessage('First name is required')
        .bail()
        .isLength({ min: 3, max: 30 }).withMessage('First name must be between 3 and 30 characters long')
        .isAlpha().withMessage('First name must contain only alphabetic characters')
        .matches(/^\S+$/).withMessage('First name must not contain spaces')
];

const validateLastName = [
    check('lastName')
        .exists().withMessage('Last name is required')
        .bail()
        .isLength({ min: 3, max: 30 }).withMessage('Last name must be between 3 and 30 characters long')
        .isAlpha().withMessage('Last name must contain only alphabetic characters')
        .matches(/^\S+$/).withMessage('Last name must not contain spaces')
];

const validateEmail = [
    check('email')
        .exists().withMessage('Email is required')
        .bail()
        .isEmail().withMessage('Please include a valid email')
];

const validatePassword = [
    check('password')
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
        })
];

const validateBalance = [
    check('balance')
        .exists().withMessage('Balance is required')
        .bail()
        .isNumeric().withMessage('Balance must be a number')
        .custom(value => {
            if (value < 0) {
                throw new Error('Balance must be greater then zero');
            }
            return true;
        })
];

const validateAmount = [
    check('amount')
        .exists().withMessage('Amount is required')
        .bail()
        .isNumeric().withMessage('Amount must be a number')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Amount must be greater then zero');
            }
            return true;
        })
];

const validateQuantity = [
    check('quantity')
        .exists().withMessage('Quantity is required')
        .bail()
        .isNumeric().withMessage('Quantity must be a number')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Quantity must be greater then zero');
            }
            return true;
        })
];

const validateType = [
    check('type')
        .exists().withMessage('Type is required')
        .bail()
        .isIn(['buy', 'sell']).withMessage(`Type must be either 'buy' or 'sell'`)
];

const validateAssetName = [
    check('assetName')
        .exists().withMessage('Asset name is required')
        .bail()
        .isLength({ min: 1, max: 30 }).withMessage('Asset name must be between 1 and 30 characters long')
        .isAlpha().withMessage('Asset name must contain only alphabetic characters')
        .matches(/^\S+$/).withMessage('Asset name must not contain spaces')
];

const validatePrice = [
    check('price')
        .exists().withMessage('Price is required')
        .bail()
        .isNumeric().withMessage('Price must be a number')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Price must be greater then zero');
            }
            return true;
        })
];

const validateAllowedFields = (allowedFields) => {
    return body().custom(body => {
        const extraFields = Object.keys(body).filter(field => !allowedFields.includes(field));
        if (extraFields.length > 0) {
            throw new Error(`Extra fields are not allowed: ${extraFields.join(', ')}`);
        }
        return true;
    });
};


module.exports = {
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePassword,
    validateBalance,
    validateAmount,
    validateQuantity,
    validateAssetName,
    validatePrice,
    validateType,
    validateAllowedFields,
}