const mongoose = require('mongoose');

const downloadTrackingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assetType: { type: String, required: true }, // 'image', 'infographic'
  assetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  format: { type: String, required: true }, // 'png', 'pdf', 'ppt', 'link_share'
}, { timestamps: true });

module.exports = mongoose.model('DownloadTracking', downloadTrackingSchema);
