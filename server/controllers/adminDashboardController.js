const User = require('../models/User');
const Infographic = require('../models/Infographic');
const Payment = require('../models/Payment');
const ApiProvider = require('../models/ApiProvider');
const ErrorLog = require('../models/ErrorLog');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    firstDayOfWeek.setHours(0,0,0,0);

    const [
      totalUsers,
      newUsersToday,
      newUsersThisWeek,
      premiumUsers,
      totalReports,
      reportsToday,
      reportsThisWeek,
      activeProviderDoc,
      errorCountToday
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ createdAt: { $gte: firstDayOfWeek } }),
      User.countDocuments({ plan: { $in: ['pro', 'enterprise'] } }),
      Infographic.countDocuments(),
      Infographic.countDocuments({ createdAt: { $gte: today } }),
      Infographic.countDocuments({ createdAt: { $gte: firstDayOfWeek } }),
      ApiProvider.findOne({ isActive: true }).lean(),
      ErrorLog.countDocuments({ createdAt: { $gte: today }, type: { $in: ['api_error', 'generation'] } })
    ]);

    // Construct active provider payload
    let activeProvider = { name: 'None', status: 'offline', successRate: 0 };
    if (activeProviderDoc) {
      // Approximate success rate: successful reports today / (successful reports + errors)
      const totalAttempts = reportsToday + errorCountToday;
      const successRate = totalAttempts > 0 ? Math.round((reportsToday / totalAttempts) * 100) : 100;
      
      activeProvider = {
        name: activeProviderDoc.name,
        status: activeProviderDoc.lastTestStatus || 'untested',
        successRate,
        errorCount: errorCountToday
      };
    }

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          newToday: newUsersToday,
          newThisWeek: newUsersThisWeek,
          free: totalUsers - premiumUsers,
          paid: premiumUsers
        },
        reports: {
          total: totalReports,
          today: reportsToday,
          thisWeek: reportsThisWeek
        },
        activeProvider
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error loading dashboard' });
  }
};

// @desc    Get chart analytics
// @route   GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Generate last 30 days for chart
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29); // 30 days including today

    // Aggregate reports grouped by day
    const dailyReports = await Infographic.aggregate([
      { 
        $match: { createdAt: { $gte: thirtyDaysAgo } } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Map into a full 30-day array (filling in missing days with 0)
    const reportVolume = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      const found = dailyReports.find(r => r._id === dateStr);
      reportVolume.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        reports: found ? found.count : 0
      });
    }

    res.json({
      success: true,
      charts: {
        reportVolume
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Server error loading analytics' });
  }
};

module.exports = { getDashboardStats, getAnalytics };
