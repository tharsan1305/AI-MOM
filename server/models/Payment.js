const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  method: { type: String, required: true }, // 'stripe', 'paypal', 'manual'
  cardLast4: { type: String },
  transactionId: { type: String },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  receiptUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
