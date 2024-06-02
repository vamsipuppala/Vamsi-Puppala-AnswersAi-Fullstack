const mongoose = require('mongoose');

const TokenUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tokensUsed: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('TokenUsage', TokenUsageSchema);
