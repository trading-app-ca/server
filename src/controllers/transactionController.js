const Transaction = require("../models/Transaction");


const getTransactions = async(request, response) => {
    try {

        // Find transactions matching user id from request body
        const transactions = await Transaction.find({ user: request.user.id });

        // Check transactions exist
        if (!transactions) {
            console.log('No transactions found');
            response.status(404).json( {msg : 'No transactions found'} );
        }

        // log success response to server log and return transactions to client 
        console.log('Transactions found');
        response.json(transactions);
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
}


module.exports = {
    getTransactions,
}
