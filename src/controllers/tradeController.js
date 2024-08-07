const Portfolio = require('../models/Portfolio');
const Trade = require('../models/Trade');
const { updatePortfolioAssets } = require('./portfolioController');


const getTrades = async(request, response) => {
    try {
        console.log('Retrieving trades');

        // Find trades matching user
        const trades = await Trade.find({ user: request.user.id });

        // Check trades exist
        if (!trades || trades.length == 0) {
            console.log('No trades found');
            return response.status(404).json({ msg: 'No trades found' });
        }

        // Log succes response to server console and return trades to client
        console.log('Trades found, Returning trades to client');
        response.json(trades);
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
};


const placeTrade = async(request, response) => {
    try {
        console.log(`Placing new trade`);

        // Set user to user object inside request
        let user = request.user;

        // Destructure the 'type', 'assetName', 'quantity', and 'price' fields from the request body 
        const { type, assetName, quantity, price } = request.body;

        switch (type) {
            case 'buy':
                console.log('Buying an asset');

                // Calculate the total cost of the purchase
                const totalCost = quantity * price;

                // Check user has sufficient balance
                if (user.balance < totalCost) {
                    const errorMessage = 'Insufficient funds';
                    console.error(errorMessage);
                    return response.status(400).json({ msg: errorMessage });
                }

                // Update users balance and save
                user.balance -= totalCost;
                await user.save();

                break;

            case 'sell':
                console.log('Selling an asset');

                // Find associated user portfolio
                const portfolio = await Portfolio.findOne({ user: user.id });

                // Find asset being sold inside portfolio
                const asset = portfolio.assets.find(a => a.asset === assetName);

                // Check user has sufficient quantity of asset to sell
                if (!asset || asset.quantity < quantity) {
                    const errorMessage = 'Insufficient quantity of asset to sell';
                    console.error(errorMessage);
                    return response.status(400).json({ msg: errorMessage });
                }

                // Calculate the total profit of the sale
                const totalProfit = quantity * price;
                user.balance += totalProfit;
                await user.save();

                break

            default:
                // Handle invalid operation
                console.log('Invalid trade type');
                response.status(400).send('Invalid trade type');
        }

        // Create a new Trade object with supplied fields
        const newTrade = new Trade({
            user: user.id,
            asset: assetName,
            quantity,
            price,
            type
        });

        console.log(newTrade);

        // Save new Trade object to database
        await newTrade.save();

        // Update portfolio assets
        await updatePortfolioAssets(newTrade, user.id);

        // Log succes response to server console and return new trade to client
        console.log(`Trade recorded: ${type} ${quantity} ${assetName} at ${price}`);
        response.json({ msg: 'Success', newTrade});
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
};


module.exports = {
    getTrades,
    placeTrade,
};