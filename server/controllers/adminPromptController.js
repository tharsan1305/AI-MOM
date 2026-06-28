const Image = require('../models/Image');

// @desc    Get all prompts (Image generation history)
// @route   GET /api/admin/prompts
const getPrompts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {};
    if (search) {
      query.prompt = { $regex: search, $options: 'i' };
    }

    const prompts = await Image.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await Image.countDocuments(query);

    res.json({
      success: true,
      prompts,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a prompt/image record
// @route   DELETE /api/admin/prompts/:id
const deletePrompt = async (req, res) => {
  try {
    const prompt = await Image.findByIdAndDelete(req.params.id);
    if (!prompt) return res.status(404).json({ success: false, message: 'Record not found' });
    
    res.json({ success: true, message: 'Prompt record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPrompts, deletePrompt };
