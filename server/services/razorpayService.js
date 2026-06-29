const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay conditionally (allows server to start even if keys are missing)
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (razorpayInstance) return razorpayInstance;
  
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    return razorpayInstance;
  }
  
  throw new Error('Razorpay API keys not configured in .env');
};

/**
 * Creates an order in Razorpay
 * @param {number} amount Amount in USD/INR (we'll multiply by 100 for smallest currency unit internally)
 * @param {string} currency 'USD' or 'INR'
 * @param {string} receipt Unique receipt ID
 */
const createOrder = async (amount, currency = 'USD', receipt) => {
  const rzp = getRazorpayInstance();
  
  const options = {
    amount: Math.round(amount * 100), // convert to smallest unit
    currency,
    receipt,
    payment_capture: 1 // auto capture
  };

  try {
    const order = await rzp.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    throw error;
  }
};

/**
 * Verifies the signature from the frontend
 */
const verifySignature = (orderId, paymentId, signature) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Missing RAZORPAY_KEY_SECRET');
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

/**
 * Verifies a webhook signature
 */
const verifyWebhookSignature = (payload, signature) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('Missing RAZORPAY_WEBHOOK_SECRET');
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return generatedSignature === signature;
};

module.exports = {
  getRazorpayInstance,
  createOrder,
  verifySignature,
  verifyWebhookSignature
};
