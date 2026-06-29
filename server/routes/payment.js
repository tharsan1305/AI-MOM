const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createOrder, verifySignature } = require('../services/razorpayService');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');

// @desc    Get Razorpay public key
// @route   GET /api/payments/config
// @access  Public
router.get('/config', (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});

// @desc    Create a new Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, currency = 'USD' } = req.body;
    
    // Receipt can just be a unique string, e.g. User ID + Timestamp
    const receipt = `rcpt_${req.user._id}_${Date.now()}`;
    
    const order = await createOrder(amount, currency, receipt);
    
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, planTier } = req.body;

    // 1. Verify signature
    const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    
    if (!isValid) {
      // Log the failed payment
      await Payment.create({
        userId: req.user._id,
        amount: amount || 0,
        method: 'razorpay',
        transactionId: razorpay_payment_id || 'unknown',
        status: 'failed'
      });
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // 2. Signature is valid -> Upgrade the user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.plan = planTier || 'pro';
    await user.save();

    // 3. Update or create Subscription
    let subscription = await Subscription.findOne({ userId: user._id });
    if (!subscription) {
      subscription = new Subscription({
        userId: user._id,
        planTier: user.plan,
        status: 'active',
        billingCycle: 'monthly',
        currentPeriodStart: new Date(),
        // Add 30 days
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
    } else {
      subscription.planTier = user.plan;
      subscription.status = 'active';
      subscription.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
    await subscription.save();

    // 4. Log the payment
    await Payment.create({
      userId: user._id,
      amount: amount || 0,
      method: 'razorpay',
      transactionId: razorpay_payment_id,
      status: 'paid'
    });

    res.json({ success: true, message: 'Payment verified and plan updated', plan: user.plan });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Internal server error during verification' });
  }
});

module.exports = router;
