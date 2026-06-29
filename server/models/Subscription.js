const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  
  // Logical plan details mapped to your app's pricing
  planTier: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free', required: true },
  billingCycle: { type: String, enum: ['monthly', 'yearly', 'lifetime'], default: 'monthly' },
  
  // Payment processor specifics (e.g. Stripe)
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  
  status: { 
    type: String, 
    enum: ['active', 'past_due', 'canceled', 'unpaid', 'trialing', 'incomplete'], 
    default: 'active' 
  },
  
  currentPeriodStart: { type: Date },
  currentPeriodEnd: { type: Date },
  
  cancelAtPeriodEnd: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
