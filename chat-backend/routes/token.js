const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenUsage = require('../models/TokenUsage');
require('dotenv').config();

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};

// Get token usage
router.get('/usage', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).send('User not found');

    const today = new Date().setHours(0, 0, 0, 0);
    const tokenUsage = await TokenUsage.findOne({ userId: user._id, date: today });
    const tokensUsed = tokenUsage ? tokenUsage.tokensUsed : 0;

    res.send({ tokensUsed });
  } catch (error) {
    console.log('Error getting token usage:', error);
    res.status(500).send('Error getting token usage');
  }
});

module.exports = router;
