const Trade = require('../models/Trade');
const User = require('../models/User');


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

        switch (type.toLowerCase()) {
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

                // NEED TO IMPLIMENT UPDATE AVERAGE PURCHASE PRICE
                break;

            case 'sell':
                console.log('Sell an asset');
                break

            default:
                // Handle invalid operation
                console.log('Invalid trade type');
                response.status(400).send('Invalid trade type');
        }
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