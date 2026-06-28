const AuditLog = require('../models/AuditLog');

const auditLogMiddleware = async (req, res, next) => {
  // Capture original res.json to log after response is sent
  const originalJson = res.json;
  
  res.json = function (data) {
    res.json = originalJson; // Restore
    
    // Log if it's an admin mutating something (POST, PUT, DELETE) and it was successful
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin') && 
        ['POST', 'PUT', 'DELETE'].includes(req.method) && 
        res.statusCode >= 200 && res.statusCode < 300) {
        
      const actionMap = {
        'POST': 'CREATE',
        'PUT': 'UPDATE',
        'DELETE': 'DELETE'
      };

      // Determine target resource from URL
      const pathParts = req.originalUrl.split('?')[0].split('/').filter(Boolean);
      // e.g. /api/admin/users/123 -> ['api', 'admin', 'users', '123']
      let resource = pathParts[2] ? pathParts[2].toUpperCase() : 'UNKNOWN';
      let targetId = req.params.id || req.body.userId || null;

      AuditLog.create({
        adminId: req.user._id,
        action: actionMap[req.method] + '_' + resource,
        targetResource: resource,
        targetId: targetId,
        details: { body: req.body, query: req.query },
        ipAddress: req.ip || req.connection.remoteAddress
      }).catch(err => console.error('Failed to write audit log:', err));
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = { auditLogMiddleware };
