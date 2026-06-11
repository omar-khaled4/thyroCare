const authController = require('./auth.controller');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../utils/helpers', () => ({
  tryCatch: jest.fn(fn => fn),
  respond: jest.fn((res, statusCode, data = null, message = "") => {
    return res.status(statusCode).json({ success: statusCode < 400, data, message });
  })
}));

jest.mock('../models/User');
jest.mock('../models/ResetToken');
jest.mock('../utils/sendEmail');

describe('Auth Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock Express request and response objects
    req = {
      body: {},
      query: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('login', () => {
    it('should return 400 if email or password are missing', async () => {
      req.body = { email: 'test@test.com' }; // missing password

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'email and password are required' })
      );
    });

    it('should return 401 if user does not exist', async () => {
      req.body = { email: 'wrong@test.com', password: 'password123' };
      User.findOne.mockResolvedValue(null);

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'wrong@test.com' });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid email or password' })
      );
    });

    it('should return 403 if user is not verified', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      
      const mockUser = {
        email: 'test@test.com',
        isEmailVerified: false,
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      User.findOne.mockResolvedValue(mockUser);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Please verify your email before logging in. Check your inbox for the verification link.' })
      );
    });

    it('should login successfully when credentials are correct and verified', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      process.env.JWT_SECRET = 'secret';
      process.env.JWT_EXPIRES_IN = '1d';
      
      const mockUser = {
        _id: 'user_id',
        email: 'test@test.com',
        isEmailVerified: true,
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      User.findOne.mockResolvedValue(mockUser);

      jest.spyOn(jwt, 'sign').mockReturnValue('mocked_token');

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Logged in successfully',
          data: {
            user: mockUser,
            token: 'mocked_token'
          }
        })
      );
    });
  });

  describe('register', () => {
    it('should return 400 if email already exists', async () => {
      req.body = { email: 'existing@test.com', password: 'password123' };
      User.findOne.mockResolvedValue(true);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'email already exists' })
      );
    });

    it('should register successfully and send verification email', async () => {
      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'new@test.com',
        password: 'password123'
      };
      
      User.findOne.mockResolvedValue(null);
      
      const mockUser = {
        ...req.body,
        isEmailVerified: false
      };
      User.create.mockResolvedValue(mockUser);
      sendEmail.mockResolvedValue(true);

      await authController.register(req, res);

      expect(User.create).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled(); // No real emails are sent!
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Registered successfully. Please check your email to verify your account.' })
      );
    });
  });
});
