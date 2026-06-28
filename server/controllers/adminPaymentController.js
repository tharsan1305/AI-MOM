const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// @desc    Get all payments
// @route   GET /api/admin/payments
const getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('userId', 'name email')
      .populate('planId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update payment status
// @route   PUT /api/admin/payments/:id
const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id).populate('userId', 'name email');
    
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    
    payment.status = status;
    await payment.save();

    // Create notification for admin
    await Notification.create({
      type: 'payment',
      title: `Payment ${status}`,
      message: `Payment of $${payment.amount} by ${payment.userId.name} was marked as ${status}.`,
      metadata: { paymentId: payment._id }
    });

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPayments, updatePaymentStatus };
