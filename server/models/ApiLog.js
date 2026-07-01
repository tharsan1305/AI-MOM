const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema({
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  provider: { type: String },
  model: { type: String },
  statusCode: { type: Number, required: true },
  responseTime: { type: Number },
  promptTokens: { type: Number, default: 0 },
  completionTokens: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  estimatedCost: { type: Number, default: 0 },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

// Add indexes for efficient admin querying
apiLogSchema.index({ userId: 1 });
apiLogSchema.index({ provider: 1 });
apiLogSchema.index({ createdAt: -1 });
apiLogSchema.index({ statusCode: 1 });

module.exports = mongoose.model('ApiLog', apiLogSchema);
