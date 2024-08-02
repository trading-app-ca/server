const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now, required: true }
},{
    toJSON: {
        transform: function (doc, transactionObject) {
            delete transactionObject.user;
            delete transactionObject.__v;
            delete transactionObject._id;
            
            return transactionObject
        }
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);