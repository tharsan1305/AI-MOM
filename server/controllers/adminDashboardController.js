const User = require('../models/User');
const Project = require('../models/Project');
const Image = require('../models/Image');
const ApiProvider = require('../models/ApiProvider');
const ErrorLog = require('../models/ErrorLog');
const ApiLog = require('../models/ApiLog');

// @desc    Get comprehensive dashboard stats
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    firstDayOfWeek.setHours(0,0,0,0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29);

    // Run all complex independent aggregations and queries in parallel
    const [
      totalUsers, newUsersToday, newUsersThisWeek, newUsersThisMonth, activeUsersToday,
      totalReports, reportsToday, reportsThisMonth,
      apiLogsSummary, apiLogsToday,
      totalImages, imagesToday,
      activeProviderDoc, mostUsedModel,
      recentUsers, recentReports, recentImages, recentApiLogs, recentErrors
    ] = await Promise.all([
      // Users
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ createdAt: { $gte: firstDayOfWeek } }),
      User.countDocuments({ createdAt: { $gte: firstDayOfMonth } }),
      User.countDocuments({ lastActive: { $gte: today } }),

      // Reports
      Project.countDocuments(),
      Project.countDocuments({ createdAt: { $gte: today } }),
      Project.countDocuments({ createdAt: { $gte: firstDayOfMonth } }),

      // API Logs
      ApiLog.aggregate([
        { $group: { 
            _id: null, 
            totalRequests: { $sum: 1 },
            totalCost: { $sum: '$estimatedCost' },
            avgResponseTime: { $avg: '$responseTime' }
        }}
      ]),
      ApiLog.countDocuments({ createdAt: { $gte: today } }),

      // Images
      Image.countDocuments(),
      Image.countDocuments({ createdAt: { $gte: today } }),

      // Providers & Models
      ApiProvider.findOne({ isActive: true }).lean(),
      ApiLog.aggregate([
        { $group: { _id: '$model', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]),

      // Widgets
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt avatar').lean(),
      Project.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(5).select('topic type createdAt').lean(),
      Image.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(5).select('prompt createdAt').lean(),
      ApiLog.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(5).lean(),
      ErrorLog.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // Trend Charts (30 days)
    const [userTrend, reportTrend, imageTrend, apiTrend] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
      ]),
      Project.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
      ]),
      Image.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
      ]),
      ApiLog.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
      ])
    ]);

    // Format trends
    const formatTrend = (data) => {
      const formatted = [];
      for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const found = data.find(r => r._id === dateStr);
        formatted.push({
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: found ? found.count : 0
        });
      }
      return formatted;
    };

    res.json({
      success: true,
      kpis: {
        totalUsers, newUsersToday, newUsersThisWeek, newUsersThisMonth, activeUsersToday,
        totalReports, reportsToday, reportsThisMonth,
        totalApiRequests: apiLogsSummary[0]?.totalRequests || 0,
        apiRequestsToday: apiLogsToday,
        totalImages, imagesToday,
        totalApiCost: (apiLogsSummary[0]?.totalCost || 0).toFixed(4),
        avgResponseTime: Math.round(apiLogsSummary[0]?.avgResponseTime || 0),
        activeProvider: activeProviderDoc ? activeProviderDoc.name : 'None',
        mostUsedModel: mostUsedModel[0]?._id || 'N/A'
      },
      charts: {
        userTrend: formatTrend(userTrend),
        reportTrend: formatTrend(reportTrend),
        imageTrend: formatTrend(imageTrend),
        apiTrend: formatTrend(apiTrend)
      },
      widgets: {
        recentUsers, recentReports, recentImages, recentApiLogs, recentErrors
      }
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: 'Server error loading dashboard' });
  }
};

module.exports = { getDashboardStats };
