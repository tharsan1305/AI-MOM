const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  amount: { type: Number, required: true },
  method: { type: String, required: true }, // 'stripe', 'paypal', 'manual'
  transactionId: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'refunded'], default: 'pending' },
  invoiceUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
