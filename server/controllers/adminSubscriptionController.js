const Subscription = require('../models/Subscription');

// @desc    Get all subscriptions
// @route   GET /api/admin/subscriptions
const getSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', plan = '' } = req.query;
    
    // We will populate user and then filter, or we can use aggregation to filter by user email
    // For simplicity, if we search, we'll fetch matching users first
    let userFilter = {};
    if (search) {
      const User = require('../models/User');
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      userFilter = { userId: { $in: matchingUsers.map(u => u._id) } };
    }

    const query = { ...userFilter };
    if (status) query.status = status;
    if (plan) query.planTier = plan;

    const subscriptions = await Subscription.find(query)
      .populate('userId', 'name email avatar plan')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
      
    const total = await Subscription.countDocuments(query);

    res.json({
      success: true,
      subscriptions,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSubscriptions };
