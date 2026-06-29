const Infographic = require('../models/Infographic');
const User = require('../models/User');

// @desc    Get all generated reports (Infographics)
// @route   GET /api/admin/generated-reports
const getGeneratedReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', userId = '', startDate = '', endDate = '' } = req.query;
    
    const query = {};
    
    // User ID filter (from a dropdown or similar)
    if (userId) {
      query.userId = userId;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Text search by title or template
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { template: { $regex: search, $options: 'i' } }
      ];
    }

    const reports = await Infographic.find(query)
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
      
    const total = await Infographic.countDocuments(query);

    // Get all users for the filter dropdown
    const users = await User.find({}, 'name email').sort({ name: 1 }).lean();

    res.json({
      success: true,
      reports,
      users, // For the filter dropdown
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching generated reports:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getGeneratedReports };
