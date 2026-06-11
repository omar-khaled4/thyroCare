const request = require('supertest');
const app = require('./app');
const User = require('./models/User');
const Report = require('./models/Report');
const Prediction = require('./models/Prediction');

// Mock external connections
jest.mock('./config/db', () => jest.fn().mockResolvedValue(true));
jest.mock('./models/User');
jest.mock('./models/Report');
jest.mock('./models/Symptom');
jest.mock('./models/Prediction');
jest.mock('./utils/sendEmail', () => jest.fn().mockResolvedValue(true));

describe('Additional Test: End-to-End (E2E) API Flow', () => {
  let authToken = '';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Step 1: User registers an account', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: 'e2e_user_id',
      email: 'e2e@test.com',
      isEmailVerified: false
    });

    const res = await request(app).post('/api/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'e2e@test.com',
      password: 'StrongPassword123!',
      phone: '1234567890'
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('Step 2: User logs in successfully after email verification', async () => {
    // Mock user being found and verified
    User.findOne.mockResolvedValue({
      _id: 'e2e_user_id',
      email: 'e2e@test.com',
      isEmailVerified: true,
      comparePassword: jest.fn().mockResolvedValue(true)
    });

    // Mock JWT signing by relying on the controller's internal jwt.sign or bypassing it
    process.env.JWT_SECRET = 'e2e_secret';
    process.env.JWT_EXPIRES_IN = '1h';

    const res = await request(app).post('/api/auth/login').send({
      email: 'e2e@test.com',
      password: 'StrongPassword123!'
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    authToken = res.body.data.token; // Save token for next steps
  });

  it('Step 3: User attempts to access a protected route without a token', async () => {
    const res = await request(app).get('/api/auth/me'); // missing Authorization header
    
    // The middleware should block it with 401
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/No token provided/i);
  });

  it('Step 4: User requests a prediction (Data Pipeline Validation)', async () => {
    // We simulate the user having a valid token (by skipping auth middleware strictly or mocking it)
    // Actually, to make it simple, we just mock the JWT verification if the auth middleware uses it
    const jwt = require('jsonwebtoken');
    jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'e2e_user_id' });

    User.findById.mockResolvedValue({ _id: 'e2e_user_id', age: 30, gender: 'Male', isEmailVerified: true });
    Report.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue({
        patientId: 'e2e_user_id',
        thyroidFunction: { tsh: 2.5, freeT3: 3.1, freeT4: 1.2 }
      })
    });
    
    // Mock global fetch for ML Model
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        diagnosis: 'Normal',
        severity: 'None',
        confidence: 0.98,
        healthScore: 90,
        recommendations: []
      })
    });

    Prediction.create.mockResolvedValue({ _id: 'pred_123' });

    const res = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer e2e_mocked_token`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.diagnosis).toBe('Normal');
  });
});
