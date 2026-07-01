const User = require('../models/User');
const Project = require('../models/Project');
const LoginHistory = require('../models/LoginHistory');
const AuditLog = require('../models/AuditLog');
const Image = require('../models/Image');
const Payment = require('../models/Payment');
const ApiCostTracking = require('../models/ApiCostTracking');
const mongoose = require('mongoose');

// @desc    Get all users with advanced filtering
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { 
      page = 1, limit = 20, search = '', 
      role, status, plan, country, method,
      startDate, endDate, activeStatus
    } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
      // Check if search is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(search)) {
        query.$or.push({ _id: search });
      }
    }

    if (role) query.role = role;
    if (status) query.status = status;
    if (plan) query.plan = plan;
    if (country) query['location.country'] = { $regex: country, $options: 'i' };
    if (method) query.registrationMethod = method;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (activeStatus === 'active') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.lastLogin = { $gte: thirtyDaysAgo };
    } else if (activeStatus === 'inactive') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.$or = [
        { lastLogin: { $lt: thirtyDaysAgo } },
        { lastLogin: { $exists: false } }
      ];
    }

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
      
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update single user
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { name, email, role, plan, status, reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Reason is required for auditing purposes.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Cannot modify superadmin' });
    }

    const beforeValue = { name: user.name, role: user.role, plan: user.plan, status: user.status };

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (plan) user.plan = plan;
    if (status) user.status = status;

    await user.save({ validateBeforeSave: false });

    await AuditLog.create({
      action: 'UPDATE_USER',
      adminId: req.user._id,
      adminName: req.user.name,
      targetType: 'User',
      targetId: user._id.toString(),
      beforeValue,
      afterValue: { name: user.name, role: user.role, plan: user.plan, status: user.status },
      reason
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk Update Users
// @route   PUT /api/admin/users/bulk
const bulkUpdateUsers = async (req, res) => {
  try {
    const { userIds, updateData, reason } = req.body;
    
    if (!reason) return res.status(400).json({ success: false, message: 'Reason required for audit.' });
    if (!Array.isArray(userIds) || userIds.length === 0) return res.status(400).json({ success: false, message: 'No users selected.' });

    // Protect superadmins
    const validUsers = await User.find({ _id: { $in: userIds }, role: { $ne: 'superadmin' } });
    const validIds = validUsers.map(u => u._id);

    await User.updateMany({ _id: { $in: validIds } }, { $set: updateData });

    await AuditLog.create({
      action: 'BULK_UPDATE_USERS',
      adminId: req.user._id,
      adminName: req.user.name,
      targetType: 'User',
      targetId: 'MULTIPLE',
      afterValue: updateData,
      reason: `${reason} (${validIds.length} users modified)`
    });

    res.json({ success: true, message: `Successfully updated ${validIds.length} users` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete (soft) single user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: 'Reason is required for auditing purposes.' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (user.role === 'superadmin') return res.status(403).json({ success: false, message: 'Cannot delete superadmin' });

    user.status = 'deleted';
    await user.save({ validateBeforeSave: false });

    await AuditLog.create({
      action: 'DELETE_USER',
      adminId: req.user._id,
      adminName: req.user.name,
      targetType: 'User',
      targetId: user._id.toString(),
      afterValue: { status: 'deleted' },
      reason
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk Delete Users
// @route   DELETE /api/admin/users/bulk
const bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds, reason } = req.body;
    
    if (!reason) return res.status(400).json({ success: false, message: 'Reason required for audit.' });
    if (!Array.isArray(userIds) || userIds.length === 0) return res.status(400).json({ success: false, message: 'No users selected.' });

    const validUsers = await User.find({ _id: { $in: userIds }, role: { $ne: 'superadmin' } });
    const validIds = validUsers.map(u => u._id);

    await User.updateMany({ _id: { $in: validIds } }, { $set: { status: 'deleted' } });

    await AuditLog.create({
      action: 'BULK_DELETE_USERS',
      adminId: req.user._id,
      adminName: req.user.name,
      targetType: 'User',
      targetId: 'MULTIPLE',
      reason: `${reason} (${validIds.length} users deleted)`
    });

    res.json({ success: true, message: `Successfully deleted ${validIds.length} users` });
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

    user.password = password; 
    await user.save();

    await AuditLog.create({
      action: 'RESET_PASSWORD',
      adminId: req.user._id,
      adminName: req.user.name,
      targetType: 'User',
      targetId: user._id.toString(),
      reason: 'Admin forced password reset'
    });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get 360-degree user details
// @route   GET /api/admin/users/:id/details
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('subscription').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    delete user.password;

    const [images, payments, logins, projects, costStats] = await Promise.all([
      Image.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20).lean(),
      Payment.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20).lean(),
      LoginHistory.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20).lean(),
      Project.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20).select('title template status createdAt').lean(),
      ApiCostTracking.aggregate([
        { $match: { userId: user._id } },
        { 
          $group: {
            _id: null,
            totalCost: { $sum: '$estimatedCostUsd' },
            totalTokens: { $sum: '$totalTokens' },
            totalRequests: { $sum: 1 }
          }
        }
      ])
    ]);

    const analytics = {
      apiCost: costStats[0]?.totalCost || 0,
      totalTokens: costStats[0]?.totalTokens || 0,
      aiRequests: costStats[0]?.totalRequests || 0
    };

    res.json({ 
      success: true, 
      user, 
      analytics,
      recentActivity: {
        images,
        payments,
        logins,
        projects
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getUsers, updateUser, bulkUpdateUsers, deleteUser, bulkDeleteUsers, 
  resetUserPassword, getUserDetails 
};
