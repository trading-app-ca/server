const request = require('supertest');
const server = require('../testServer'); // Use the test server
const connectTestDB = require('../testDb'); // Use the test database connection
const mongoose = require('mongoose');
const User = require('../../models/User');
const Portfolio = require('../../models/Portfolio');
const jwt = require('jsonwebtoken');
const delay = require('../delay'); // Import the delay helper

beforeAll(async () => {
    await connectTestDB(); // Connect to the test database
    await server.listen(5005); // Start the server on a different port for testing
});

afterAll(async () => {
    // Disconnect and clean up the test database
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    await server.close(); // Close the server after tests
});

describe('User API Endpoints', () => {
    let token;
    let userId;

    beforeAll(async () => {
        // Register a new user and get the token
        const res = await request(server)
            .post('/api/auth/register')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'test.user@example.com',
                password: 'Password123'
            });
        token = res.body.token;

        // Decode the user id from the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.user.id;
    });

    it('should get user info', async () => {
        const res = await request(server)
            .get('/api/user')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('email', 'test.user@example.com');
        await delay(1000); // Add delay
    });

    it('should update user info', async () => {
        const res = await request(server)
            .put('/api/user')
            .send({
                firstName: 'Updated',
                lastName: 'User'
            })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.user).toHaveProperty('firstName', 'Updated');
        expect(res.body.user).toHaveProperty('lastName', 'User');
        await delay(1000); // Add delay
    });

    it('should deposit funds', async () => {
        const res = await request(server)
            .post('/api/user/deposit')
            .send({ amount: 100 })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'Successfully, deposited $100');
        await delay(1000); // Add delay
    });

    it('should withdraw funds', async () => {
        const res = await request(server)
            .post('/api/user/withdraw')
            .send({ amount: 50 })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'Successfully, withdrew $50');
        await delay(1000); // Add delay
    });

    it('should not withdraw funds if insufficient balance', async () => {
        const res = await request(server)
            .post('/api/user/withdraw')
            .send({ amount: 200 })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', 'Insufficient funds');
        await delay(1000); // Add delay
    });

    it('should delete the user', async () => {
        const res = await request(server)
            .delete('/api/user')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'User and associated data deleted successfully');

        // Ensure the user is deleted
        const deletedUser = await User.findById(userId);
        expect(deletedUser).toBeNull();

        // Ensure the portfolio is deleted
        const deletedPortfolio = await Portfolio.findOne({ user: userId });
        expect(deletedPortfolio).toBeNull();
        await delay(1000); // Add delay
    });
});
