const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RevokedToken = require('../models/RevokedToken');


module.exports = async function(request, response, next) {
    try {
        // Retrieve token from header
        const token = request.header('Authorization').replace('Bearer ', '');

        // Check if token is not present
        if(!token) {
            return response.status(401).json({ msg: 'No token, authorization denied' });
        }

        console.log('Checking user Authorization');

        // Check if the token is in the revoked tokens list
        const revokedToken = await RevokedToken.findOne({ token });
        if(revokedToken) {
            console.log('Authorization denied, Token has been revoked', revokedToken);
            return response.status(401).json({ msg: 'Authorization denied, Token has been revoked' });
        }

        // Verify token
        const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);
        request.User = decodedJwt.User;
        console.log('User authorized, Token is Valid');

        next();
    } catch (error) {
        // Log error in console and send response to client 
        console.log('Token is not valid', error);
        response.status(401).json({ msg: 'Token is not valid' });
    }
};