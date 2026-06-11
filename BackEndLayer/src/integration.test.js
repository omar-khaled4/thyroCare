const request = require('supertest');
const app = require('./app');
const User = require('./models/User');

// Mock dependencies
jest.mock('./config/db', () => jest.fn().mockResolvedValue(true)); // Mock DB Connection Middleware
jest.mock('./models/User');
jest.mock('./utils/sendEmail', () => jest.fn().mockResolvedValue(true));

describe('Integration Tests - API Endpoints', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check Endpoint (/)', () => {
    it('should return 200 and success message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Thyroid Lab API is running. Go to /api');
    });
  });

  describe('Auth Routes (/api/auth)', () => {
    it('POST /register - should register a new user successfully', async () => {
      // Mock the User model to simulate email doesn't exist, and create succeeds
      User.findOne.mockResolvedValue(null);
      
      const mockUser = {
        _id: 'integration_user_id',
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration@test.com',
        isEmailVerified: false
      };
      
      User.create.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Integration',
          lastName: 'Test',
          email: 'integration@test.com',
          password: 'Password123!',
          phone: '1234567890'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/Registered successfully/);
    });

    it('POST /login - should return 401 for invalid credentials', async () => {
      User.findOne.mockResolvedValue(null); // User not found

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@test.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('Global Error Handling Middleware', () => {
    it('should catch unexpected errors and return 500', async () => {
      // Force User.findOne to throw an error to test the global error handler
      User.findOne.mockRejectedValue(new Error('Database explosion'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'crash@test.com', password: 'password123' });

      // The tryCatch helper passes the error to next(err), which hits the global errorHandler
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Database explosion');
      // Notice: Since this is an integration test, it proves the error middleware is wired up correctly!
    });
  });

});
