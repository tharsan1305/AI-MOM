const os = require('os');
const mongoose = require('mongoose');

// @desc    Get system status and server monitoring stats
// @route   GET /api/admin/system
const getSystemStatus = async (req, res) => {
  try {
    // OS Metrics
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);
    
    const cpuLoad = os.loadavg(); // Returns an array containing the 1, 5, and 15 minute load averages
    const cpus = os.cpus();
    const uptime = os.uptime();

    // Database Metrics
    const dbState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
    
    // Sockets
    const io = req.app.get('io');
    const activeSessions = io ? io.engine.clientsCount : 0;

    res.json({
      success: true,
      system: {
        server: {
          platform: os.platform(),
          architecture: os.arch(),
          uptime: uptime,
          cpus: cpus.length,
          cpuLoad: cpuLoad,
          memory: {
            total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
            used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
            free: (freeMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
            usagePercent: memUsagePercent
          }
        },
        database: {
          status: dbStatus,
          host: mongoose.connection.host,
          name: mongoose.connection.name
        },
        network: {
          activeSessions: activeSessions
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSystemStatus };
