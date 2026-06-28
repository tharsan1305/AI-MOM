const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'registration', 'payment', 'error', 'limit_exceeded', 'system'
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed }, // flexible payload
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
