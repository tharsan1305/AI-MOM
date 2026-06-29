const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  defaultAiModel: { type: String, default: 'dall-e-3' },
  maintenanceMode: { type: Boolean, default: false },
  registrationEnabled: { type: Boolean, default: true },
  paymentsEnabled: { type: Boolean, default: false },
  imageGenEnabled: { type: Boolean, default: true },
  rateLimiterEnabled: { type: Boolean, default: true },
  featureFlags: {
    enableIllustratedTemplates: { type: Boolean, default: true },
    enablePdfExport: { type: Boolean, default: false }
  },
  globalLimits: {
    defaultPromptLimitDaily: { type: Number, default: 3 },
    maxUploadSizeMB: { type: Number, default: 10 },
  },
  branding: {
    companyName: { type: String, default: 'MinuteCraft' },
    logoUrl: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
  },
  smtp: {
    host: { type: String, default: '' },
    port: { type: Number, default: 587 },
    user: { type: String, default: '' },
    pass: { type: String, default: '' },
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
