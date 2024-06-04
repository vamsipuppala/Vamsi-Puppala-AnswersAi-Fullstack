import request from 'supertest';
import mongoose from 'mongoose';
import { app, server } from '../server.js';
import User from '../models/User.js';
import TokenUsage from '../models/TokenUsage.js';

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
  await TokenUsage.deleteMany({});
});

describe('Chat Routes', () => {
  let token;

  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'Test1234' });

    await User.findOneAndUpdate({ email: 'test@example.com' }, { isVerified: true });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Test1234' });

    token = res.body.token;
  });

  describe('POST /api/chat', () => {
    it('should send a message and receive a response', async () => {
      const res = await request(app)
        .post('/api/chat')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: 'Hello' });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('response');
    }, 60000); // Increase timeout to 60 seconds
  });

  describe('GET /api/chat/token-usage', () => {
    it('should get token usage for the user', async () => {
      const res = await request(app)
        .get('/api/chat/token-usage')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('tokensUsed');
    }, 60000); // Increase timeout to 60 seconds
  });
});
