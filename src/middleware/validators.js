const { check } = require('express-validator');

const validateFirstName = [
    check('firstName')
        .exists().withMessage('First name is required')
        .bail()
        .isLength({ min: 3 }).withMessage('First name must be at least 3 characters long')
        .isAlphanumeric().withMessage('First name must contain only alphanumeric characters')
        .matches(/^\S+$/).withMessage('First name must not contain spaces')
];



const validateEmail = check('email', 'Please include a valid email').isEmail();

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

module.exports = {
    validateFirstName,
    validateEmail,
    validatePassword
}