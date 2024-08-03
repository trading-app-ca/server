const Trade = require('../models/Trade');


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


module.exports = {
    getTrades,
};