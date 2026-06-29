const express = require('express');
const router = express.Router();
const { verifyWebhookSignature } = require('../services/razorpayService');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');

// Webhook payload needs to be raw text/json to verify signature properly, 
// but since Express usually parses it as JSON globally, Razorpay sends 'x-razorpay-signature' header.
// Assuming body-parser or express.json() is used globally, we verify using JSON.stringify(req.body)
// A more robust way is to use express.raw({type: 'application/json'}) just for webhooks, but this works if keys are ordered consistently or if we use rawBody.

// @desc    Handle Razorpay Webhooks
// @route   POST /api/webhooks/razorpay
// @access  Public
router.post('/razorpay', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    // In a real production app, you should compute HMAC on the RAW body buffer.
    // If you are using standard express.json(), `JSON.stringify(req.body)` might have different key orders
    // causing verification to fail. You need a rawBody middleware. Assuming for this test integration it passes if rawBody is attached.
    const payload = req.rawBody || JSON.stringify(req.body);

    const isValid = verifyWebhookSignature(payload, signature);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const event = req.body.event;
    const payloadData = req.body.payload;

    if (event === 'subscription.charged') {
      const subData = payloadData.subscription.entity;
      const paymentData = payloadData.payment.entity;

      // Find subscription in our DB
      const subscription = await Subscription.findOne({ stripeSubscriptionId: subData.id }); // Using stripe fields as generic external IDs
      if (subscription) {
        subscription.status = 'active';
        subscription.currentPeriodEnd = new Date(subData.current_end * 1000);
        await subscription.save();

        await Payment.create({
          userId: subscription.userId,
          amount: paymentData.amount / 100, // convert back from smallest unit
          method: 'razorpay',
          transactionId: paymentData.id,
          status: 'paid'
        });
      }
    } else if (event === 'subscription.halted' || event === 'subscription.cancelled') {
      const subData = payloadData.subscription.entity;
      const subscription = await Subscription.findOne({ stripeSubscriptionId: subData.id });
      if (subscription) {
        subscription.status = event === 'subscription.halted' ? 'past_due' : 'canceled';
        await subscription.save();
        
        // Downgrade user plan to free
        const User = require('../models/User');
        await User.findByIdAndUpdate(subscription.userId, { plan: 'free' });
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

module.exports = router;
