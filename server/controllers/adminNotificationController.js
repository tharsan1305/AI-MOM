const Notification = require('../models/Notification');

// @desc    Get all notifications
// @route   GET /api/admin/notifications
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await Notification.countDocuments();
    const unread = await Notification.countDocuments({ isRead: false });

    res.json({
      success: true,
      notifications,
      unread,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/admin/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    
    notification.isRead = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Broadcast a new notification
// @route   POST /api/admin/notifications/broadcast
const createBroadcast = async (req, res) => {
  try {
    const { title, message, targetType, targetRoles, targetUsers } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const notification = new Notification({
      type: 'broadcast',
      title,
      message,
      targetType: targetType || 'all',
      targetRoles: targetRoles || [],
      targetUsers: targetUsers || [],
      isRead: false
    });

    await notification.save();

    res.json({ success: true, notification, message: 'Broadcast sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNotifications, markAsRead, createBroadcast };
