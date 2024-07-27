const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RevokedToken = require('../models/RevokedToken');


module.exports = async function(request, response, next) {
    try {
        // Retrieve token from header
        const token = request.header('Authorization').replace('Bearer ', '');

        // Check if token is present
        if(!token) {
            return response.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Check if the token is in the revoked tokens list
        const revokedToken = await RevokedToken.findOne({ token });
        if(revokedToken) {
            console.log('msg: Token has been revoked, authorization denied');
            return response.status(401).json({ msg: 'Token has been revoked, authorization denied' });
        }

        // Verify token
        const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);
        request.User = decodedJwt.User;
        console.log('msg: Token is Valid, user authorized');

        next();
    } catch (error) {
        // Log error in console and send response to client 
        console.log('msg: Token is not valid', error);
        response.status(401).json({ msg: 'Token is not valid' });
    }
};