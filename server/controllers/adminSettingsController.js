const Settings = require('../models/Settings');

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
    
    // Merge updates
    if (updates.defaultAiModel !== undefined) settings.defaultAiModel = updates.defaultAiModel;
    if (updates.maintenanceMode !== undefined) settings.maintenanceMode = updates.maintenanceMode;
    if (updates.registrationEnabled !== undefined) settings.registrationEnabled = updates.registrationEnabled;
    if (updates.paymentsEnabled !== undefined) settings.paymentsEnabled = updates.paymentsEnabled;
    if (updates.imageGenEnabled !== undefined) settings.imageGenEnabled = updates.imageGenEnabled;
    
    if (updates.apiKeys) {
      settings.apiKeys = { ...settings.apiKeys, ...updates.apiKeys };
    }
    if (updates.globalLimits) {
      settings.globalLimits = { ...settings.globalLimits, ...updates.globalLimits };
    }

    await settings.save();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
