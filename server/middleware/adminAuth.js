const { protect } = require('./auth');

const adminAuth = async (req, res, next) => {
  // First, verify standard JWT authentication
  await protect(req, res, (err) => {
    if (err) return next(err); // if standard protect fails, bubble up
    
    // Now verify admin role
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
  });
};

const superAdminAuth = async (req, res, next) => {
  await protect(req, res, (err) => {
    if (err) return next(err);
    
    if (req.user && req.user.role === 'superadmin') {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Not authorized as a super admin' });
    }
  });
};

module.exports = { adminAuth, superAdminAuth };
