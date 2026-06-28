const BrandKit = require('../models/BrandKit');

// @desc    Get user's brand kit
// @route   GET /api/brand
const getBrandKit = async (req, res) => {
  try {
    let brandKit = await BrandKit.findOne({ userId: req.user._id });
    if (!brandKit) {
      brandKit = await BrandKit.create({ userId: req.user._id });
    }
    res.json({ success: true, brandKit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update brand kit
// @route   PUT /api/brand
const updateBrandKit = async (req, res) => {
  try {
    const { logoUrl, primaryColor, fontFamily } = req.body;
    let brandKit = await BrandKit.findOne({ userId: req.user._id });
    
    if (!brandKit) {
      brandKit = new BrandKit({ userId: req.user._id });
    }
    
    if (logoUrl !== undefined) brandKit.logoUrl = logoUrl;
    if (primaryColor) brandKit.primaryColor = primaryColor;
    if (fontFamily) brandKit.fontFamily = fontFamily;
    
    await brandKit.save();
    
    res.json({ success: true, brandKit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getBrandKit, updateBrandKit };
