const mongoose = require('mongoose');

const apiCostTrackingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  provider: { type: String, required: true }, // 'openai', 'gemini', 'claude'
  model: { type: String, required: true },
  endpoint: { type: String, required: true }, // e.g., '/images/generations', '/chat/completions'
  inputTokens: { type: Number, default: 0 },
  outputTokens: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  imageCount: { type: Number, default: 0 },
  generationTimeMs: { type: Number, required: true },
  estimatedCostUsd: { type: Number, required: true },
  status: { type: String, enum: ['success', 'failed'], default: 'success' },
  errorDetails: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ApiCostTracking', apiCostTrackingSchema);
