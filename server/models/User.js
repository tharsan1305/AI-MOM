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
  lastLogin: { type: Date },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  totalDownloads: { type: Number, default: 0 },
  favoriteTemplates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Template' }]
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
