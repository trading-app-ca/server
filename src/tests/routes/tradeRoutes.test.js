const request = require('supertest');
const server = require('../testServer'); // Use the test server
const connectTestDB = require('../testDb'); // Use the test database connection
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const delay = require('../delay'); // Import the delay helper

beforeAll(async () => {
    await connectTestDB(); // Connect to the test database
    await server.listen(5003); // Start the server on a different port for testing
});

afterAll(async () => {
    // Disconnect and clean up the test database
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    await server.close(); // Close the server after tests
});

describe('Trade API Endpoints', () => {
    let token;
    let userId;

    beforeAll(async () => {
        // Register and log in a user to obtain a token
        const res = await request(server)
            .post('/api/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'SecurePassword123'
            });

        expect(res.statusCode).toEqual(200);
        token = res.body.token;

        const loginRes = await request(server)
            .post('/api/auth/login')
            .send({
                email: 'john.doe@example.com',
                password: 'SecurePassword123'
            });

        expect(loginRes.statusCode).toEqual(200);
        token = loginRes.body.token;

        // Decode the token to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.user.id;

        // Deposit funds to enable trading
        const depositRes = await request(server)
            .post('/api/user/deposit')
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: 100000 }); // Deposit enough funds for trading

        expect(depositRes.statusCode).toEqual(200);
        await delay(1000); // Add delay
    });

    it('should place a new buy trade', async () => {
        const res = await request(server)
            .post('/api/trades/new-trade')
            .set('Authorization', `Bearer ${token}`)
            .send({
                type: 'buy',
                assetName: 'BTC',
                quantity: 1,
                price: 50000
            });

        console.log('Buy Trade Response:', res.body);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'Success');
        expect(res.body.newTrade).toHaveProperty('type', 'buy');
        expect(res.body.newTrade).toHaveProperty('asset', 'BTC');
        await delay(1000); // Add delay
    });

    it('should place a new sell trade', async () => {
        const res = await request(server)
            .post('/api/trades/new-trade')
            .set('Authorization', `Bearer ${token}`)
            .send({
                type: 'sell',
                assetName: 'BTC',
                quantity: 1,
                price: 50000
            });

        console.log('Sell Trade Response:', res.body);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'Success');
        expect(res.body.newTrade).toHaveProperty('type', 'sell');
        expect(res.body.newTrade).toHaveProperty('asset', 'BTC');
        await delay(1000); // Add delay
    });

    it('should retrieve trades', async () => {
        const res = await request(server)
            .get('/api/trades')
            .set('Authorization', `Bearer ${token}`);

        console.log('Retrieve Trades Response:', res.body);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('type');
        expect(res.body[0]).toHaveProperty('asset');
        expect(res.body[0]).toHaveProperty('quantity');
        expect(res.body[0]).toHaveProperty('price');
        expect(res.body[0]).toHaveProperty('date');
        await delay(1000); // Add delay
    });
});
