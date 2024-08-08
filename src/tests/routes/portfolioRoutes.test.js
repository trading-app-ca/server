const request = require('supertest');
const server = require('../testServer'); // Use the test server
const connectTestDB = require('../testDb'); // Use the test database connection
const mongoose = require('mongoose');

beforeAll(async () => {
    await connectTestDB(); // Connect to the test database
    await server.listen(5002); // Start the server on a different port for testing
});

afterAll(async () => {
    // Disconnect and clean up the test database
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    await server.close(); // Close the server after tests
});

describe('Portfolio API Endpoints', () => {
    let token;

    beforeAll(async () => {
        // Register and login a user to get a token
        await request(server)
            .post('/api/auth/register')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'test.user@example.com',
                password: 'Password123'
            });

        const loginRes = await request(server)
            .post('/api/auth/login')
            .send({
                email: 'test.user@example.com',
                password: 'Password123'
            });

        token = loginRes.body.token;
    });

    it('should retrieve the user\'s portfolio', async () => {
        const res = await request(server)
            .get('/api/portfolio')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('assets');
    });

});
