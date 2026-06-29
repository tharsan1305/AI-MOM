const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs
// @route   GET /api/admin/audit-logs
const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = '', actionType = '', startDate = '', endDate = '' } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { adminName: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { targetId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (actionType) {
      query.action = actionType;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
      
    const total = await AuditLog.countDocuments(query);

    // Get unique action types for the filter dropdown
    const uniqueActions = await AuditLog.distinct('action');

    res.json({
      success: true,
      logs,
      uniqueActions,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAuditLogs };
