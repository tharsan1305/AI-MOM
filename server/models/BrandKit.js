const mongoose = require('mongoose');

const brandKitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  logoUrl: { type: String, default: '' },
  primaryColor: { type: String, default: '#3B82F6' },
  fontFamily: { type: String, default: 'Inter' },
}, { timestamps: true });

module.exports = mongoose.model('BrandKit', brandKitSchema);
