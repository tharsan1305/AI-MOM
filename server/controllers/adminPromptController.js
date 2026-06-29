const PromptLog = require('../models/PromptLog');

// @desc    Get all prompts (Prompt History)
// @route   GET /api/admin/prompts
const getPrompts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', provider = '' } = req.query;
    
    const query = {};
    if (search) {
      query.rawNotes = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }
    if (provider) {
      query.aiProvider = provider;
    }

    const prompts = await PromptLog.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await PromptLog.countDocuments(query);

    res.json({
      success: true,
      prompts,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching prompt history:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a prompt record
// @route   DELETE /api/admin/prompts/:id
const deletePrompt = async (req, res) => {
  try {
    const prompt = await PromptLog.findByIdAndDelete(req.params.id);
    if (!prompt) return res.status(404).json({ success: false, message: 'Record not found' });
    
    res.json({ success: true, message: 'Prompt record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPrompts, deletePrompt };
