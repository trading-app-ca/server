const mongoose = require('mongoose');

const RevokedTokenSchema = new mongoose.Schema({
    token: {type: String, required: true },
    revokedAt: { type: Date, default: Date.now, expires: 'EXPIRE_TIME' } // Placeholder for dynamic expiration
});

module.exports = mongoose.model('RevokedToken', RevokedTokenSchema);