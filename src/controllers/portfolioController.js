const Portfolio = require("../models/Portfolio");
const Trade = require("../models/Trade");


const createPortfolio = async(user) => {
    try {
        console.log('Creating portfolio');

        const newPortfolio = new Portfolio({ user: user.id, assets: [] });
        await newPortfolio.save();
        console.log(`Portfolio created for user ${user}`);
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        throw new Error(`Server error`);
    }
}

const getPortfolio = async(request, response) => {
    try {
        console.log('Retreiving Portfolio');

        // Find portfolio matching user id from request
        const portfolio = await Portfolio.findOne({ user: request.user.id });

        // Check if portfolio exists
        if (!portfolio) {
            console.log('Portfolio not found');
            response.status(404).json({ msg: 'Portfolio not found' });
        }

        // Set assets to portfoli.assets
        const assets = portfolio.assets;
        
        // Check portfolio contains assets
        if (!assets) {
            console.log('Assets not found');
            return response.status(404).json({ msg: 'Assets not found' });
        }

        // log success response to server log and return assets to client 
        console.log('Assets found returning to client');
        response.json({ assets });
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
};


const updatePortfolioAssets = async(newTrade, userId) => {
    try {
        console.log('Updating Portfolio assets');

        // Deconstruct newTrade object
        const { user, asset: assetName, quantity, price, type } = newTrade;

        // Find portfolio associated with user
        let portfolio = await Portfolio.findOne({ user: userId });

        
        const asset = portfolio.assets.find(a => a.asset === assetName);

        switch (type) {
            case 'buy':
                // Check if asset exists in portfolio
                if (asset) {
                    console.log(`Asset '${assetName}' already exists in portfolio.`);
                    // Find new average purchase price
                    const averagePurchasePrice = await calculateAveragePurchasePrice(assetName, asset.quantity, asset.averagePurchasePrice, quantity, price, type, userId);

                    asset.quantity += quantity;
                    asset.averagePurchasePrice = averagePurchasePrice;

                } else {
                    // If no asset exists in portfolio add the new asset
                    portfolio.assets.push({ asset: assetName, quantity: quantity, averagePurchasePrice: price });
                }
                break;

            case 'sell':
                // Check if asset exists in portfolio
                if (asset) {
                    // If selling all remaing quantity of asset in portfolio
                    if (asset.quantity === quantity) {
                        // Filter out the asset to be removed
                        const newAssets = portfolio.assets.filter(a => a.asset !== assetName);

                        // Update the portfolio with the new assets array
                        portfolio.assets = newAssets;

                    } else {
                        // Find new average purchase price for asset
                        const averagePurchasePrice = await calculateAveragePurchasePrice(assetName, asset.quantity, asset.averagePurchasePrice, quantity, price, type, userId);
    
                        asset.quantity -= quantity;
                        asset.averagePurchasePrice = averagePurchasePrice;

                    }

                } else {
                    // If no asset exists in portfolio return error
                    
                }
                break;

            default:
                // Handle invalid operation
                console.log('Invalid trade type');
                return response.status(400).send('Invalid trade type');
        };
        await portfolio.save();

        console.log(`Portfolio updated for user ${userId}`);
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        throw new Error(`Server error`);
    }
};

const calculateAveragePurchasePrice = async(assetName, totalQuantity, averagePurchasePrice, newQuantity, newPrice, type, userId) => {
    try {
        console.log('Calculating new average purchase price');

        // Calculate the current total cost of asset
        let totalCost = totalQuantity * averagePurchasePrice;

        // Declare required variables
        let newTotalCost;
        let newTotalQuantity;
        let newAveragePurchasePrice;

        switch (type) {
            case 'buy':
                // Calculate the new total cost of the asset after buying
                newTotalCost = totalCost + (newQuantity * newPrice);
                // Calculate the new total quantity of the asset after buying
                newTotalQuantity = totalQuantity + newQuantity;
                // Calculate the new average purchase price
                newAveragePurchasePrice = newTotalCost / newTotalQuantity;
                break;

            case 'sell':
                // Fetch all buy trades for the user and the specific asset in descending order by date
                const trades = await Trade.find({ user: userId, asset: assetName, type: 'buy'}).sort({ date: -1 });

                // Calculate the new total quantity of the asset after selling
                newTotalQuantity = totalQuantity - newQuantity;

                // Initialize tracking variables for the remaining quantity and cost
                let trackQuantityRemaining = newTotalQuantity;
                let trackTotalCost = 0;
                let trackTotalQuantity = 0;
                let trackNewAverage = 0;

                // Loop through each trade and process quantities from newest to oldest
                for (let trade of trades) {

                    // Break the loop if the required quantity is processed 
                    if ( trackQuantityRemaining <= 0 ) {
                        console.log('breaking the loop');
                        break;
                    }
                    
                    // Calculate the new total cost of the asset considering the trade quantity
                    trackTotalCost += ((trade.quantity > trackQuantityRemaining ? trackQuantityRemaining : trade.quantity) * trade.price);

                    // Calculate the new total quantity of the asset considering the trade quantity
                    trackTotalQuantity += trade.quantity > trackQuantityRemaining ? trackQuantityRemaining : trade.quantity;

                    // Calculate the new average purchase price
                    trackNewAverage = trackTotalCost / trackTotalQuantity;

                    // Reduce the quantity of asset trades left to check by the trade quantity
                    trackQuantityRemaining -= trade.quantity;

                }
                
                // Set the new average purchase price after processing all relevant trades
                newAveragePurchasePrice = trackNewAverage;
                break;

            default:
                // Handle invalid operation
                console.log('Invalid trade type');
                return response.status(400).send('Invalid trade type');
        }


        // Log new average purchase price and return price
        console.log(`New average purchase price: ${newAveragePurchasePrice}`);
        return newAveragePurchasePrice;

    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        throw new Error('Server error');
    }
};


module.exports = {
    getPortfolio,
    createPortfolio,
    updatePortfolioAssets,
    calculateAveragePurchasePrice,
};