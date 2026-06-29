const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminName: { type: String, required: true },
  targetType: { type: String, required: true }, // e.g., 'User', 'Settings', 'ApiProvider', 'Plan'
  targetId: { type: String }, // Can be ObjectId or String (like 'gemini')
  beforeValue: { type: mongoose.Schema.Types.Mixed },
  afterValue: { type: mongoose.Schema.Types.Mixed },
  reason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
