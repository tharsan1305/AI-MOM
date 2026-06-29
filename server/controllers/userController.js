const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const Project = require('../models/Project');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const bcrypt = require('bcryptjs');

// @desc    Get current user profile
// @route   GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    const projectCount = await Project.countDocuments({ userId: user._id, status: 'completed' });
    res.json({
      success: true,
      user: {
        _id: user._id, name: user.name, email: user.email,
        avatar: user.avatar, plan: user.plan,
        totalInfographics: projectCount,
        totalDownloads: user.totalDownloads,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const { name, avatarBase64 } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;

    if (avatarBase64) {
      const uploadRes = await cloudinary.uploader.upload(avatarBase64, {
        folder: 'minutecraft/avatars',
        transformation: [{ width: 200, height: 200, crop: 'fill' }],
      });
      user.avatar = uploadRes.secure_url;
    }

    await user.save();
    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, plan: user.plan },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/user/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (user.password && !(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/user/stats
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalInfographics = await Project.countDocuments({ userId, status: 'completed' });
    const recentProjects = await Project.find({ userId }).sort({ createdAt: -1 }).limit(5).select('title template createdAt status');
    res.json({ success: true, stats: { totalInfographics, totalDownloads: req.user.totalDownloads, recentProjects } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get billing and payment history
// @route   GET /api/user/billing
const getBillingDetails = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
    
    res.json({
      success: true,
      subscription,
      payments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel subscription
// @route   POST /api/user/subscription/cancel
const cancelSubscription = async (req, res) => {
  try {
    // In a real integration, you would call Razorpay's API to cancel the subscription here
    // e.g. await razorpay.subscriptions.cancel(subscription.stripeSubscriptionId);

    const subscription = await Subscription.findOne({ userId: req.user._id });
    if (subscription) {
      subscription.status = 'canceled';
      subscription.cancelAtPeriodEnd = true;
      await subscription.save();
    }

    const user = await User.findById(req.user._id);
    user.plan = 'free';
    await user.save();

    res.json({ success: true, message: 'Subscription canceled', plan: 'free' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, changePassword, getStats, getBillingDetails, cancelSubscription };
