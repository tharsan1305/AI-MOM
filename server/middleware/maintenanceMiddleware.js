const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Settings = require('../models/Settings');

const checkMaintenanceMode = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    if (!settings || !settings.maintenanceMode) {
      return next();
    }

    // Maintenance mode is ON. Check if user is an admin.
    let isAdmin = false;
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('role');
        if (user && (user.role === 'admin' || user.role === 'superadmin')) {
          isAdmin = true;
        }
      } catch (err) {
        // Token invalid/expired - treat as non-admin
      }
    }

    if (isAdmin) {
      return next(); // Admins bypass maintenance mode
    }

    // Allow login routes so admins can actually log in during maintenance
    if (
      req.path.startsWith('/auth/login') ||
      req.path.startsWith('/auth/admin-login') ||
      req.path.startsWith('/health') ||
      req.path.startsWith('/settings/public')
    ) {
      return next();
    }

    // Block the request
    return res.status(503).json({ 
      success: false, 
      message: 'MinuteCraft AI is currently undergoing scheduled maintenance. We will be back shortly.',
      isMaintenance: true
    });

  } catch (error) {
    console.error('Maintenance Middleware Error:', error);
    next(); // Fail open if DB is down so health checks can report
  }
};

module.exports = { checkMaintenanceMode };
