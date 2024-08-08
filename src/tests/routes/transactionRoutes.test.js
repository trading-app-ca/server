const request = require('supertest');
const server = require('../testServer'); // Use the test server
const connectTestDB = require('../testDb'); // Use the test database connection
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // Import jwt
const delay = require('../delay'); // Import the delay helper

beforeAll(async () => {
    await connectTestDB(); // Connect to the test database
    await server.listen(5004); // Start the server on a different port for testing
});

afterAll(async () => {
    // Disconnect and clean up the test database
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    await server.close(); // Close the server after tests
});

describe('Transaction API Endpoints', () => {
    let token;
    let userId;

    beforeAll(async () => {
        // Register and login a new user to get a token
        const res = await request(server)
            .post('/api/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'SecurePassword123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;

        // Decode the token to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.user.id;

        // Deposit some money into the user's account
        await request(server)
            .post('/api/user/deposit')
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: 1000 });
        await delay(1000); // Add delay
    });

    it('should retrieve transactions', async () => {
        // Place a new buy trade to create a transaction
        await request(server)
            .post('/api/trades/new-trade')
            .set('Authorization', `Bearer ${token}`)
            .send({
                type: 'buy',
                assetName: 'BTC',
                quantity: 1,
                price: 50000
            });
        await delay(1000); // Add delay

        const res = await request(server)
            .get('/api/transactions')
            .set('Authorization', `Bearer ${token}`);
        
        console.log('Retrieve Transactions Response:', res.body);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);

        // Check the properties of each transaction
        res.body.forEach(transaction => {
            expect(transaction).toHaveProperty('type');
            expect(transaction).toHaveProperty('date');

            if (transaction.type === 'Deposit') {
                expect(transaction).toHaveProperty('amount', 1000);
            } else {
                expect(transaction).toHaveProperty('user', userId);
                expect(transaction).toHaveProperty('asset', 'BTC');
                expect(transaction).toHaveProperty('quantity', 1);
                expect(transaction).toHaveProperty('price', 50000);
            }
        });
        
        await delay(1000); // Add delay
    });
});