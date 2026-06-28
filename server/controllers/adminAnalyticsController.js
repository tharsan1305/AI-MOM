const ApiCostTracking = require('../models/ApiCostTracking');
const MeetingTopic = require('../models/MeetingTopic');
const Image = require('../models/Image');
const User = require('../models/User');
const ErrorLog = require('../models/ErrorLog');
const mongoose = require('mongoose');

// Helper for date ranges
const getDateRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisWeek = new Date(today);
  thisWeek.setDate(today.getDate() - 7);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return { today, thisWeek, thisMonth };
};

// @desc    Get Analytics Overview
// @route   GET /api/admin/analytics/overview
const getOverview = async (req, res) => {
  try {
    const { today, thisWeek, thisMonth } = getDateRange();

    const [
      costStats,
      imageStats,
      userStats,
      recentRequests,
      errorCount
    ] = await Promise.all([
      ApiCostTracking.aggregate([
        { 
          $group: { 
            _id: null, 
            totalCost: { $sum: '$estimatedCostUsd' },
            totalTokens: { $sum: '$totalTokens' },
            totalRequests: { $sum: 1 },
            avgGenTime: { $avg: '$generationTimeMs' },
            successCount: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } }
          } 
        }
      ]),
      Image.aggregate([
        { $group: { _id: null, totalImages: { $sum: 1 } } }
      ]),
      User.countDocuments(),
      ApiCostTracking.aggregate([
        { 
          $facet: {
            today: [{ $match: { createdAt: { $gte: today } } }, { $count: 'count' }],
            week: [{ $match: { createdAt: { $gte: thisWeek } } }, { $count: 'count' }],
            month: [{ $match: { createdAt: { $gte: thisMonth } } }, { $count: 'count' }]
          }
        }
      ]),
      ErrorLog.countDocuments()
    ]);

    const stats = costStats[0] || { totalCost: 0, totalTokens: 0, totalRequests: 0, avgGenTime: 0, successCount: 0 };
    const successRate = stats.totalRequests > 0 ? ((stats.successCount / stats.totalRequests) * 100).toFixed(2) : 100;
    
    res.json({
      success: true,
      data: {
        totalRequests: stats.totalRequests,
        totalImages: imageStats[0]?.totalImages || 0,
        totalTokens: stats.totalTokens,
        totalCost: stats.totalCost.toFixed(4),
        avgGenTimeMs: stats.avgGenTime ? stats.avgGenTime.toFixed(0) : 0,
        successRate,
        errorCount,
        requestsToday: recentRequests[0]?.today[0]?.count || 0,
        requestsWeek: recentRequests[0]?.week[0]?.count || 0,
        requestsMonth: recentRequests[0]?.month[0]?.count || 0,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Token Analytics
// @route   GET /api/admin/analytics/tokens
const getTokenAnalytics = async (req, res) => {
  try {
    const stats = await ApiCostTracking.aggregate([
      {
        $group: {
          _id: '$userId',
          totalTokens: { $sum: '$totalTokens' },
          avgTokensPerRequest: { $avg: '$totalTokens' },
          requestCount: { $sum: 1 }
        }
      },
      { $sort: { totalTokens: -1 } },
      { $limit: 10 }
    ]);
    
    // Populate user names (efficiently using lookup or lean queries)
    const populatedStats = await User.populate(stats, { path: '_id', select: 'name email' });
    
    res.json({ success: true, data: populatedStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Provider Analytics
// @route   GET /api/admin/analytics/providers
const getProviderAnalytics = async (req, res) => {
  try {
    const stats = await ApiCostTracking.aggregate([
      {
        $group: {
          _id: '$provider',
          totalRequests: { $sum: 1 },
          totalCost: { $sum: '$estimatedCostUsd' },
          avgGenTimeMs: { $avg: '$generationTimeMs' },
          successCount: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } }
        }
      }
    ]);
    
    const formattedStats = stats.map(s => ({
      provider: s._id,
      totalRequests: s.totalRequests,
      totalCost: s.totalCost.toFixed(4),
      avgGenTimeMs: s.avgGenTimeMs.toFixed(0),
      successRate: ((s.successCount / s.totalRequests) * 100).toFixed(2)
    }));
    
    res.json({ success: true, data: formattedStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Topic Analytics
// @route   GET /api/admin/analytics/topics
const getTopicAnalytics = async (req, res) => {
  try {
    const stats = await MeetingTopic.aggregate([
      {
        $group: {
          _id: '$topic',
          frequency: { $sum: '$frequency' }
        }
      },
      { $sort: { frequency: -1 } },
      { $limit: 20 }
    ]);
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Cost Trends (Last 7 Days)
// @route   GET /api/admin/analytics/cost-trends
const getCostTrends = async (req, res) => {
  try {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      return d;
    }).reverse();

    const stats = await ApiCostTracking.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days[0] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          cost: { $sum: '$estimatedCostUsd' },
          requests: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOverview,
  getTokenAnalytics,
  getProviderAnalytics,
  getTopicAnalytics,
  getCostTrends
};
