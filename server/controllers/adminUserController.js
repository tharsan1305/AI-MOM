const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role, status, plan } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;
    if (plan) query.plan = plan;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { name, email, role, plan, status } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    // Prevent changing superadmin role unless by another superadmin
    if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Cannot modify superadmin' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.plan = plan || user.plan;
    user.status = status || user.status;

    await user.save({ validateBeforeSave: false });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete (soft) user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (user.role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'Cannot delete superadmin' });
    }

    // Soft delete
    user.status = 'deleted';
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset user password
// @route   PUT /api/admin/users/:id/reset-password
const resetUserPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.password = password; // Pre-save hook will hash it
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get full user details (history)
// @route   GET /api/admin/users/:id/details
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('subscription');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const Image = require('../models/Image');
    const Payment = require('../models/Payment');
    const LoginHistory = require('../models/LoginHistory');

    const [images, payments, logins] = await Promise.all([
      Image.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10),
      Payment.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10),
      LoginHistory.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10)
    ]);

    res.json({ success: true, user, images, payments, logins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, updateUser, deleteUser, resetUserPassword, getUserDetails };
