const Settings = require('../models/Settings');
const AuditLog = require('../models/AuditLog');

// Helper to get or create settings
const getSettingsDoc = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// @desc    Get platform settings
// @route   GET /api/admin/settings
const getSettings = async (req, res) => {
  try {
    const settings = await getSettingsDoc();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update platform settings
// @route   PUT /api/admin/settings
const updateSettings = async (req, res) => {
  try {
    const settings = await getSettingsDoc();
    const updates = req.body;
    
    // Capture before state for audit log
    const beforeValue = settings.toObject();

    // Merge updates
    if (updates.defaultAiModel !== undefined) settings.defaultAiModel = updates.defaultAiModel;
    if (updates.maintenanceMode !== undefined) settings.maintenanceMode = updates.maintenanceMode;
    if (updates.registrationEnabled !== undefined) settings.registrationEnabled = updates.registrationEnabled;
    if (updates.paymentsEnabled !== undefined) settings.paymentsEnabled = updates.paymentsEnabled;
    if (updates.rateLimiterEnabled !== undefined) settings.rateLimiterEnabled = updates.rateLimiterEnabled;
    
    if (updates.featureFlags) {
      settings.featureFlags = { ...settings.featureFlags, ...updates.featureFlags };
    }
    if (updates.globalLimits) {
      settings.globalLimits = { ...settings.globalLimits, ...updates.globalLimits };
    }

    await settings.save();

    // Create Audit Log
    await AuditLog.create({
      action: 'UPDATE_GLOBAL_SETTINGS',
      adminId: req.user._id,
      adminName: req.user.name,
      targetType: 'Settings',
      targetId: settings._id.toString(),
      beforeValue,
      afterValue: settings.toObject(),
      reason: updates.reason || 'Manual settings update from admin dashboard'
    });

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
