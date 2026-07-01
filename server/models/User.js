const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  avatar: { type: String, default: '' },
  googleId: { type: String },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' },
  phone: { type: String, trim: true },
  promptsToday: { type: Number, default: 0 },
  promptsResetDate: { type: Date },
  totalPrompts: { type: Number, default: 0 },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  totalDownloads: { type: Number, default: 0 },
  favoriteTemplates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Template' }],

  // Login Tracking
  lastLogin: { type: Date },
  lastLogout: { type: Date },
  loginCount: { type: Number, default: 0 },
  lastActive: { type: Date },

  // Device Info
  deviceInfo: {
    type: { type: String, default: 'Unknown' },
    os: { type: String, default: 'Unknown' },
    browser: { type: String, default: 'Unknown' },
    browserVersion: { type: String, default: 'Unknown' },
    resolution: { type: String },
    language: { type: String },
    timezone: { type: String }
  },

  // Location
  location: {
    country: { type: String },
    state: { type: String },
    city: { type: String },
    ip: { type: String },
    timezone: { type: String }
  },

  // Usage Stats
  registrationMethod: { type: String, enum: ['email', 'google'], default: 'email' },
  reportsGenerated: { type: Number, default: 0 },
  imagesGenerated: { type: Number, default: 0 },
  aiRequests: { type: Number, default: 0 },
  uploads: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  totalApiCost: { type: Number, default: 0 },
  paymentStatus: { type: String, default: 'unpaid' }

}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
