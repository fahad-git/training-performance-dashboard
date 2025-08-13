const request = require('supertest'); // Supertest for API testing
const app = require('../app'); // Import the main Express app

describe('Training Data - Integration Tests', () => {

  // Test if the server is running
  it('should return 200 OK for the insights route', async () => {
    const response = await request(app).get('/api/v1/insights');
    expect(response.status).toBe(200);
  });

  // Test invalid route handling (404 error)
  it('should return 404 for an unknown route', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });
});
