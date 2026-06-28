const User = require('../models/User');
const Image = require('../models/Image');
const Payment = require('../models/Payment');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    // Run aggregations in parallel
    const [
      totalUsers,
      activeUsers,
      newUsersToday,
      premiumUsers,
      totalImages,
      imagesToday,
      paymentsToday,
      paymentsMonthly,
      paymentsYearly
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ plan: { $in: ['pro', 'enterprise'] } }),
      Image.countDocuments(),
      Image.countDocuments({ createdAt: { $gte: today } }),
      Payment.aggregate([{ $match: { status: 'approved', createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Payment.aggregate([{ $match: { status: 'approved', createdAt: { $gte: firstDayOfMonth } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Payment.aggregate([{ $match: { status: 'approved', createdAt: { $gte: firstDayOfYear } } }, { $group: { _id: null, total: { $sum: "$amount" } } }])
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        newUsersToday,
        premiumUsers,
        freeUsers: totalUsers - premiumUsers,
        totalImages,
        promptsUsedToday: imagesToday, // 1 image = 1 prompt for now
        revenue: {
          today: paymentsToday[0]?.total || 0,
          monthly: paymentsMonthly[0]?.total || 0,
          yearly: paymentsYearly[0]?.total || 0,
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get chart analytics
// @route   GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    // Generate last 6 months for chart
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        start: new Date(d.getFullYear(), d.getMonth(), 1),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0)
      });
    }

    // Get user growth data
    const userGrowth = await Promise.all(months.map(async (m) => {
      const count = await User.countDocuments({ createdAt: { $lte: m.end } });
      return { name: m.name, users: count };
    }));

    // Get prompt usage data
    const promptUsage = await Promise.all(months.map(async (m) => {
      const count = await Image.countDocuments({
        createdAt: { $gte: m.start, $lte: m.end }
      });
      return { name: m.name, prompts: count };
    }));
    
    // Get revenue data
    const revenueData = await Promise.all(months.map(async (m) => {
      const result = await Payment.aggregate([
        { $match: { status: 'approved', createdAt: { $gte: m.start, $lte: m.end } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      return { name: m.name, revenue: result[0]?.total || 0 };
    }));

    res.json({
      success: true,
      charts: {
        userGrowth,
        promptUsage,
        revenue: revenueData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, getAnalytics };
