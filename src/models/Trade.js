const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    asset: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ['buy', 'sell'], required: true },
    date: { type: Date, default: Date.now, required: true }
},{
    toJSON: {
        transform: function (doc, tradeObject) {
            delete tradeObject.user;
            delete tradeObject.__v;
            delete tradeObject._id;
            
            return tradeObject
        }
    }
});

module.exports = mongoose.model('Trade', TradeSchema);