const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  ipAddress: { type: String },
  device: { type: String },
  browser: { type: String },
  status: { type: String, enum: ['success', 'failed'], default: 'success' },
}, { timestamps: true });

module.exports = mongoose.model('LoginHistory', loginHistorySchema);
