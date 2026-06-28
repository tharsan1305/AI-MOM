const Template = require('../models/Template');
const User = require('../models/User');

// @desc    Get all active templates (Public/User)
// @route   GET /api/templates
const getTemplates = async (req, res) => {
  try {
    const { category, search, isPremium } = req.query;
    let query = { isActive: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';

    const templates = await Template.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: templates.length, templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle Favorite Template (User)
// @route   POST /api/templates/:id/favorite
const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const templateId = req.params.id;

    // Ensure favoriteTemplates array exists
    if (!user.favoriteTemplates) user.favoriteTemplates = [];

    const isFavorited = user.favoriteTemplates.includes(templateId);

    if (isFavorited) {
      user.favoriteTemplates = user.favoriteTemplates.filter(id => id.toString() !== templateId);
    } else {
      user.favoriteTemplates.push(templateId);
    }

    await user.save();
    res.json({ success: true, isFavorited: !isFavorited, favorites: user.favoriteTemplates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ADMIN CONTROLLERS
// ==========================================

// @desc    Get all templates including inactive (Admin)
// @route   GET /api/templates/admin
const adminGetTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json({ success: true, count: templates.length, templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Template (Admin)
// @route   POST /api/templates
const createTemplate = async (req, res) => {
  try {
    const template = await Template.create(req.body);
    res.status(201).json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Template (Admin)
// @route   PUT /api/templates/:id
const updateTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Template (Admin)
// @route   DELETE /api/templates/:id
const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTemplates,
  toggleFavorite,
  adminGetTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
};
