const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock User model BEFORE requiring controllers
jest.mock('../models/User');
const User = require('../models/User');

const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Setup minimal app
const app = express();
app.use(express.json());

// Routes setup for testing
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.get('/api/auth/profile', protect, getUserProfile);

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  describe('POST /api/auth/register', () => {
    it('should register a user and return 201 with token', async () => {
      // Mock findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);
      // Mock create to return the user
      User.create.mockResolvedValue({
        id: '1',
        _id: '1',
        name: 'Test',
        email: 'test@example.com'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe('test@example.com');
    });

    it('should return 400 if user exists', async () => {
      User.findOne.mockResolvedValue({ id: '1', email: 'test@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user and return 200 with token', async () => {
      // Mock matchPassword on the resolved user
      const mockUser = {
        id: '1',
        _id: '1',
        name: 'Test',
        email: 'test@example.com',
        matchPassword: jest.fn().mockResolvedValue(true)
      };
      
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 with wrong password', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        matchPassword: jest.fn().mockResolvedValue(false)
      };
      
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.statusCode).toBe(401);
    });

    it('should return 200 with valid token', async () => {
      const token = jwt.sign({ id: '1' }, 'test_secret');
      
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ id: '1', name: 'Test' })
      });

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Test');
    });
  });
});
