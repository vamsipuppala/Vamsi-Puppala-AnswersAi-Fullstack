import request from 'supertest';
import mongoose from 'mongoose';
import { app, server } from '../server.js';
import User from '../models/User.js';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/chatapp_test', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  server.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'Test1234' });
      
      expect(res.status).toBe(201);
      expect(res.text).toBe('User registered. Please verify your email.');
    }, 60000); // Increase timeout to 60 seconds
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'Test1234' });

      await User.findOneAndUpdate({ email: 'test@example.com' }, { isVerified: true });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'Test1234' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    }, 60000); // Increase timeout to 60 seconds

    it('should not login an unverified user', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'unverified@example.com', password: 'Test1234' });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'unverified@example.com', password: 'Test1234' });

      expect(res.status).toBe(400);
      expect(res.text).toBe('Please verify your email.');
    }, 60000); // Increase timeout to 60 seconds
  });
});
