const Portfolio = require("../models/Portfolio");


const createPortfolio = async(user) => {
    try {
        console.log('Creating portfolio');

        const newPortfolio = new Portfolio({ user: user.id, assets: [] });
        await newPortfolio.save();
        console.log(`Portfolio created for user ${user}`);
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
}

const getPortfolio = async(request, response) => {
    try {
        console.log('Retreiving Portfolio');

        // Find portfolio matching user id from request
        const portfolio = Portfolio.find({ user: request.user.id });

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


module.exports = {
    getPortfolio,
    createPortfolio,
};