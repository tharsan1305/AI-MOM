const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true }, // 'api_error', 'timeout', 'validation', 'generation'
  provider: { type: String }, // 'openai', etc. if applicable
  message: { type: String, required: true },
  stack: { type: String },
  endpoint: { type: String },
  requestPayload: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('ErrorLog', errorLogSchema);
