const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  defaultAiModel: { type: String, default: 'dall-e-3' },
  maintenanceMode: { type: Boolean, default: false },
  registrationEnabled: { type: Boolean, default: true },
  paymentsEnabled: { type: Boolean, default: false },
  imageGenEnabled: { type: Boolean, default: true },
  apiKeys: {
    openai: { type: String, default: '' },
    gemini: { type: String, default: '' },
    claude: { type: String, default: '' },
    replicate: { type: String, default: '' }
  },
  globalLimits: {
    defaultPromptLimitDaily: { type: Number, default: 3 },
    maxUploadSizeMB: { type: Number, default: 10 },
  },
  branding: {
    companyName: { type: String, default: 'MeetGraph AI' },
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
