const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'registration', 'error', 'system', 'broadcast'
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  
  // Targeting rules for broadcasts
  targetType: { type: String, enum: ['all', 'role', 'users', 'admins'], default: 'admins' },
  targetRoles: [{ type: String }],
  targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Tracking who has read it (if it's a broadcast to multiple users)
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  metadata: { type: mongoose.Schema.Types.Mixed }, // flexible payload
}, { timestamps: true });

notificationSchema.index({ targetType: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
