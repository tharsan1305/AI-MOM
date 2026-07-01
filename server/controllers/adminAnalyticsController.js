const ApiCostTracking = require('../models/ApiCostTracking');
const MeetingTopic = require('../models/MeetingTopic');
const Image = require('../models/Image');
const User = require('../models/User');
const ErrorLog = require('../models/ErrorLog');
const Project = require('../models/Project');
const mongoose = require('mongoose');

// @desc    Get complete AI Analytics
// @route   GET /api/admin/analytics/full
const getCompleteAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() - 7);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29);

    const [
      costStats,
      imageStats,
      errorStats,
      costTrends,
      providerStats,
      modelStats,
      topUsers,
      userActivity
    ] = await Promise.all([
      // 1. Overall Cost & KPI Stats
      ApiCostTracking.aggregate([
        {
          $facet: {
            overall: [
              {
                $group: {
                  _id: null,
                  totalRequests: { $sum: 1 },
                  totalCost: { $sum: '$estimatedCostUsd' },
                  avgGenTime: { $avg: '$generationTimeMs' },
                  fastestRequest: { $min: { $cond: [{ $gt: ['$generationTimeMs', 0] }, '$generationTimeMs', null] } },
                  slowestRequest: { $max: '$generationTimeMs' },
                  totalTokens: { $sum: '$totalTokens' },
                  totalPromptTokens: { $sum: '$inputTokens' },
                  totalCompletionTokens: { $sum: '$outputTokens' },
                  highestTokenRequest: { $max: '$totalTokens' }
                }
              }
            ],
            today: [{ $match: { createdAt: { $gte: today } } }, { $group: { _id: null, cost: { $sum: '$estimatedCostUsd' }, requests: { $sum: 1 } } }],
            week: [{ $match: { createdAt: { $gte: thisWeek } } }, { $group: { _id: null, cost: { $sum: '$estimatedCostUsd' }, requests: { $sum: 1 } } }],
            month: [{ $match: { createdAt: { $gte: thisMonth } } }, { $group: { _id: null, cost: { $sum: '$estimatedCostUsd' }, requests: { $sum: 1 } } }]
          }
        }
      ]),
      // 2. Images Stats
      Image.aggregate([
        {
          $facet: {
            overall: [{ $count: 'count' }],
            today: [{ $match: { createdAt: { $gte: today } } }, { $count: 'count' }],
            week: [{ $match: { createdAt: { $gte: thisWeek } } }, { $count: 'count' }],
            month: [{ $match: { createdAt: { $gte: thisMonth } } }, { $count: 'count' }]
          }
        }
      ]),
      // 3. Error Analytics
      ErrorLog.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]),
      // 4. Trends (Last 30 Days)
      ApiCostTracking.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            cost: { $sum: '$estimatedCostUsd' },
            requests: { $sum: 1 },
            avgTokens: { $avg: '$totalTokens' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      // 5. Provider Usage & Performance
      ApiCostTracking.aggregate([
        {
          $group: {
            _id: '$provider',
            totalRequests: { $sum: 1 },
            totalCost: { $sum: '$estimatedCostUsd' },
            avgGenTimeMs: { $avg: '$generationTimeMs' },
            avgTokens: { $avg: '$totalTokens' },
            successCount: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
            lastUsed: { $max: '$createdAt' }
          }
        },
        { $sort: { totalRequests: -1 } }
      ]),
      // 6. Model Usage
      ApiCostTracking.aggregate([
        {
          $group: {
            _id: '$model',
            totalRequests: { $sum: 1 },
            totalTokens: { $sum: '$totalTokens' },
            totalCost: { $sum: '$estimatedCostUsd' },
            successCount: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } }
          }
        },
        { $sort: { totalRequests: -1 } }
      ]),
      // 7. Top Users
      ApiCostTracking.aggregate([
        {
          $group: {
            _id: '$userId',
            totalRequests: { $sum: 1 },
            totalCost: { $sum: '$estimatedCostUsd' },
            lastActive: { $max: '$createdAt' }
          }
        },
        { $sort: { totalRequests: -1 } },
        { $limit: 10 }
      ]),
      // 8. User Activity
      Project.aggregate([
        {
          $facet: {
            dau: [{ $match: { createdAt: { $gte: today } } }, { $group: { _id: '$userId' } }, { $count: 'count' }],
            wau: [{ $match: { createdAt: { $gte: thisWeek } } }, { $group: { _id: '$userId' } }, { $count: 'count' }],
            mau: [{ $match: { createdAt: { $gte: thisMonth } } }, { $group: { _id: '$userId' } }, { $count: 'count' }]
          }
        }
      ])
    ]);

    // Format KPIs
    const overall = costStats[0]?.overall[0] || {};
    const kpis = {
      totalRequests: {
        allTime: overall.totalRequests || 0,
        today: costStats[0]?.today[0]?.requests || 0,
        week: costStats[0]?.week[0]?.requests || 0,
        month: costStats[0]?.month[0]?.requests || 0
      },
      apiCost: {
        allTime: overall.totalCost || 0,
        today: costStats[0]?.today[0]?.cost || 0,
        week: costStats[0]?.week[0]?.cost || 0,
        month: costStats[0]?.month[0]?.cost || 0
      },
      images: {
        allTime: imageStats[0]?.overall[0]?.count || 0,
        today: imageStats[0]?.today[0]?.count || 0,
        week: imageStats[0]?.week[0]?.count || 0,
        month: imageStats[0]?.month[0]?.count || 0
      },
      generationTime: {
        avg: overall.avgGenTime || 0,
        fastest: overall.fastestRequest || 0,
        slowest: overall.slowestRequest || 0
      }
    };

    // Format Token Analytics
    const tokenAnalytics = {
      totalPromptTokens: overall.totalPromptTokens || 0,
      totalCompletionTokens: overall.totalCompletionTokens || 0,
      totalTokens: overall.totalTokens || 0,
      avgTokensPerRequest: overall.totalRequests ? (overall.totalTokens / overall.totalRequests) : 0,
      highestTokenRequest: overall.highestTokenRequest || 0
    };

    // Populate Top Users
    const populatedTopUsers = await User.populate(topUsers, { path: '_id', select: 'name email plan totalDownloads' });
    const formattedTopUsers = populatedTopUsers.map(u => ({
      userId: u._id?._id,
      name: u._id?.name || 'Unknown',
      email: u._id?.email || 'N/A',
      plan: u._id?.plan || 'N/A',
      requests: u.totalRequests,
      downloads: u._id?.totalDownloads || 0,
      cost: u.totalCost,
      lastActive: u.lastActive
    }));

    // Format Error Analytics
    const failedRequests = providerStats.reduce((acc, p) => acc + (p.totalRequests - p.successCount), 0);
    const errorsBreakdown = errorStats.reduce((acc, e) => {
      acc[e._id || 'unknown'] = e.count;
      return acc;
    }, {});
    const errorAnalytics = {
      failedRequests,
      successRate: overall.totalRequests > 0 ? (((overall.totalRequests - failedRequests) / overall.totalRequests) * 100).toFixed(2) : 100,
      breakdown: errorsBreakdown
    };

    // Format User Activity
    const activity = {
      dau: userActivity[0]?.dau[0]?.count || 0,
      wau: userActivity[0]?.wau[0]?.count || 0,
      mau: userActivity[0]?.mau[0]?.count || 0
    };

    // Format Provider Performance
    const providerPerformance = providerStats.map(p => ({
      provider: p._id,
      requests: p.totalRequests,
      successRate: p.totalRequests > 0 ? ((p.successCount / p.totalRequests) * 100).toFixed(2) : 0,
      avgResponseTime: p.avgGenTimeMs,
      avgTokens: p.avgTokens,
      avgCost: p.totalRequests > 0 ? (p.totalCost / p.totalRequests) : 0,
      totalCost: p.totalCost,
      lastUsed: p.lastUsed,
      health: p.successCount / p.totalRequests > 0.9 ? 'Healthy' : 'Degraded'
    }));

    // Ensure 30 days of trends are mapped correctly
    const trends = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const found = costTrends.find(c => c._id === dateStr);
      trends.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rawDate: dateStr,
        requests: found ? found.requests : 0,
        cost: found ? found.cost : 0,
        avgCost: found && found.requests > 0 ? (found.cost / found.requests) : 0,
        avgTokens: found ? found.avgTokens : 0
      });
    }

    res.json({
      success: true,
      data: {
        kpis,
        trends,
        providers: providerPerformance,
        models: modelStats,
        topUsers: formattedTopUsers,
        tokens: tokenAnalytics,
        errors: errorAnalytics,
        activity
      }
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Failed to load analytics data' });
  }
};

module.exports = {
  getCompleteAnalytics
};
