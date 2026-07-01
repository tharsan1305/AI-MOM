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

    // Merge updates deeply
    if (updates.general) {
      settings.general = { ...settings.general, ...updates.general };
    }
    if (updates.ai) {
      settings.ai = { ...settings.ai, ...updates.ai };
    }
    if (updates.auth) {
      if (updates.auth.passwordPolicy) {
        settings.auth.passwordPolicy = { ...settings.auth.passwordPolicy, ...updates.auth.passwordPolicy };
      }
      settings.auth = { ...settings.auth, ...updates.auth, passwordPolicy: settings.auth.passwordPolicy };
    }
    if (updates.branding) {
      settings.branding = { ...settings.branding, ...updates.branding };
    }
    if (updates.security) {
      settings.security = { ...settings.security, ...updates.security };
    }
    if (updates.storage) {
      settings.storage = { ...settings.storage, ...updates.storage };
    }
    if (updates.backup) {
      settings.backup = { ...settings.backup, ...updates.backup };
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
