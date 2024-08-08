const request = require('supertest');
const server = require('../testServer'); // Use the test server
const connectTestDB = require('../testDb'); // Use the test database connection
const mongoose = require('mongoose');
const delay = require('../delay'); // Import the delay helper

beforeAll(async () => {
    await connectTestDB(); // Connect to the test database
    await server.listen(5001); // Start the server on a different port for testing
});

afterAll(async () => {
    // Disconnect and clean up the test database
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    await server.close(); // Close the server after tests
});

describe('Auth API Endpoints', () => {
    let token;

    it('should register a new user', async () => {
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
        await delay(1000); // Add delay
    });

    it('should login the user', async () => {
        const res = await request(server)
            .post('/api/auth/login')
            .send({
                email: 'john.doe@example.com',
                password: 'SecurePassword123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token; // Save the token for subsequent tests
        await delay(1000); // Add delay
    });

    it('should verify the password', async () => {
        const res = await request(server)
            .post('/api/auth/verify-password')
            .send({ password: 'SecurePassword123' })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'Verified');
        await delay(1000); // Add delay
    });

    it('should logout the user', async () => {
        const res = await request(server)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'User logged out successfully');
        await delay(1000); // Add delay
    });

    it('should not verify the password after logout', async () => {
        const res = await request(server)
            .post('/api/auth/verify-password')
            .send({ password: 'SecurePassword123' })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('msg', 'Authorization denied, Token has been revoked');
        await delay(1000); // Add delay
    });
});
