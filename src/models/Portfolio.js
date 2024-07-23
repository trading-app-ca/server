const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    asset: { type: String, required: true },
    quantity: { type: Number, required: true },
    averagePurchasePrice: { type: Number, required: true }
});

const PortfolioSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.types.objectId, ref: 'User', required: true },
    assets: [AssetSchema]
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);