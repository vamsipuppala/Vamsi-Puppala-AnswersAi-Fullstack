const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ChatHistory = require('../models/ChatHistory');
const { getAnthropicResponse } = require('../services/anthropic');
const TokenUsage = require('../models/TokenUsage');
require('dotenv').config();

module.exports = (io) => {
  const router = express.Router();

  // Middleware to authenticate JWT
  const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.log('Access denied. No token provided.');
      return res.status(401).send('Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('Access denied. Invalid token format.');
      return res.status(401).send('Access denied. Invalid token format.');
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      next();
    } catch (ex) {
      console.log('Invalid token.', ex);
      res.status(400).send('Invalid token.');
    }
  };

  // Chat endpoint
  router.post('/', authenticateJWT, async (req, res) => {
    const { message } = req.body;
    console.log(`Received message: ${message}`);

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        console.log('User not found');
        return res.status(400).send('User not found');
      }

      // Check token usage limit
      const today = new Date().setHours(0, 0, 0, 0);
      let tokenUsage = await TokenUsage.findOne({ userId: user._id, date: today });
      if (tokenUsage && tokenUsage.tokensUsed >= 1000) {
        console.log('Daily token limit reached');
        return res.status(403).send('Daily token limit reached');
      }

      // Get response from Anthropic API
      const response = await getAnthropicResponse(message);
      console.log(`Anthropic response: ${response}`);

      // Calculate tokens used (by words)
      const tokensUsed = message.split(' ').length + response.split(' ').length;

      // Update token usage
      if (tokenUsage) {
        tokenUsage.tokensUsed += tokensUsed;
        await tokenUsage.save();
      } else {
        tokenUsage = new TokenUsage({
          userId: user._id,
          tokensUsed,
          date: today,
        });
        await tokenUsage.save();
      }

      // Save chat history
      const chatHistory = new ChatHistory({
        userId: user._id,
        message,
        response,
      });
      await chatHistory.save();

      // Emit message event to the specific client
      io.emit('message', { message, response, tokensUsed: tokenUsage.tokensUsed });
      console.log('Emitted message:', { message, response, tokensUsed: tokenUsage.tokensUsed });

      res.send({ message, response, tokensUsed: tokenUsage.tokensUsed });
    } catch (error) {
      console.log('Error during chat:', error);
      res.status(500).send('Error during chat');
    }
  });

  // Endpoint to get current token usage
  router.get('/token-usage', authenticateJWT, async (req, res) => {
    try {
      const today = new Date().setHours(0, 0, 0, 0);
      const tokenUsage = await TokenUsage.findOne({ userId: req.user.id, date: today });
      const tokensUsed = tokenUsage ? tokenUsage.tokensUsed : 0;
      res.send({ tokensUsed });
    } catch (error) {
      console.log('Error fetching token usage:', error);
      res.status(500).send('Error fetching token usage');
    }
  });

  return router;
};
