const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  promptLimitDaily: { type: Number, required: true }, // -1 for unlimited
  promptLimitMonthly: { type: Number, required: true },
  imageLimit: { type: Number, required: true },
  storageLimit: { type: Number, required: true }, // in MB
  exportLimit: { type: Number, required: true },
  imageQuality: { type: String, enum: ['standard', 'hd'], default: 'standard' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
