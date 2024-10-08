const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    asset: { type: String, required: true },
    quantity: { type: Number, required: true },
    averagePurchasePrice: { type: Number, required: true }
});

const PortfolioSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assets: [AssetSchema]
},{
    toJSON: {
        transform: function (doc, portfolioObject) {
            delete portfolioObject._id;
            
            return portfolioObject
        }
    }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);