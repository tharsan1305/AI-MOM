const Notification = require('../models/Notification');

const createNotification = async (type, title, message, metadata = {}) => {
  try {
    await Notification.create({
      type,
      title,
      message,
      metadata
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

module.exports = { createNotification };
