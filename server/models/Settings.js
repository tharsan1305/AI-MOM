const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  general: {
    websiteName: { type: String, default: 'MinuteCraft' },
    contactEmail: { type: String, default: 'support@minutecraft.ai' },
    maintenanceMode: { type: Boolean, default: false },
    registrationEnabled: { type: Boolean, default: true }
  },
  ai: {
    defaultProvider: { type: String, default: 'groq' },
    defaultModel: { type: String, default: 'mixtral-8x7b-32768' },
    maxTokensPerRequest: { type: Number, default: 4000 },
    globalRateLimitPerMinute: { type: Number, default: 60 }
  },
  auth: {
    jwtExpiryDays: { type: Number, default: 7 },
    enableGoogleOAuth: { type: Boolean, default: true },
    passwordPolicy: {
      minLength: { type: Number, default: 8 },
      requireUppercase: { type: Boolean, default: true },
      requireNumbers: { type: Boolean, default: true },
      requireSpecialChars: { type: Boolean, default: false }
    }
  },
  branding: {
    companyName: { type: String, default: 'MinuteCraft' },
    logoUrl: { type: String, default: '' },
    theme: { type: String, default: 'light', enum: ['light', 'dark', 'system'] },
    primaryColor: { type: String, default: '#6366f1' }
  },
  security: {
    sessionTimeoutMinutes: { type: Number, default: 120 },
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutDurationMinutes: { type: Number, default: 15 },
    requireEmailVerification: { type: Boolean, default: false }
  },
  storage: {
    maxUploadSizeMB: { type: Number, default: 10 },
    allowedFileTypes: [{ type: String, default: ['image/jpeg', 'image/png', 'application/pdf'] }],
    retentionDays: { type: Number, default: 30 }
  },
  backup: {
    autoBackupEnabled: { type: Boolean, default: true },
    backupFrequency: { type: String, default: 'daily', enum: ['hourly', 'daily', 'weekly'] },
    retentionCount: { type: Number, default: 7 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
