const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number,  default: 0, required: false },
    createdAt: { type: Date, default: Date.now, required: true }
}, {
    toJSON: {
        transform: function (doc, userObject) {
            delete userObject.password;
            delete userObject.__v;
            delete userObject._id;
            
            return userObject
        }
    }
});

module.exports = mongoose.model('User', UserSchema);