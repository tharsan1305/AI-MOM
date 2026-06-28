const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  prompt: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageData: {
    type: String,
    // Base64 encoded image data (fallback when URL is not available)
  },
  size: {
    type: String,
    default: '1024x1024',
  },
  resolution: {
    type: String,
    default: '1024x1024',
  },
  fileSize: {
    type: Number,
    default: 0,
  },
  generationTimeMs: {
    type: Number,
    default: 0,
  },
  model: {
    type: String,
    default: 'dall-e-3',
  },
}, {
  timestamps: true,
});

// Index for efficient user-based queries sorted by date
imageSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Image', imageSchema);
