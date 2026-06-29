const { v4: uuidv4 } = require('uuid');
const Project = require('../models/Project');
const User = require('../models/User');
const { extractMeetingData } = require('../utils/aiProcessor');
const { parseFile } = require('../utils/fileParser');

const ApiCostTracking = require('../models/ApiCostTracking');
const { performance } = require('perf_hooks');

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (!ai.interactions) {
  ai.interactions = {
    create: async (params) => {
      const res = await ai.models.generateContent({ model: params.model, contents: params.input });
      return { output_text: res.text };
    }
  };
}

// @desc    Generate infographic (AI extraction)
// @route   POST /api/infographic/generate
const generateInfographic = async (req, res) => {
  try {
    let { text, inputType, template } = req.body;

    // Handle file upload
    if (req.file) {
      text = await parseFile(req.file);
    }

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide meeting notes text or upload a file' });
    }

    // AI extraction
    const { success, data } = await extractMeetingData(text, inputType || 'meeting_minutes');

    // Create project record
    const project = await Project.create({
      userId: req.user._id,
      title: data.meetingTitle || 'Meeting Notes',
      inputText: text,
      inputType: inputType || 'meeting_minutes',
      template: template || 'corporate',
      status: 'completed',
      metadata: {
        meetingTitle: data.meetingTitle,
        date: data.date,
        attendees: data.attendees || [],
        discussionPoints: data.discussionPoints || [],
        keyOutcomes: data.keyOutcomes || [],
        actionItems: data.actionItems || [],
        risks: data.risks || [],
        nextSteps: data.nextSteps || [],
        statusUpdates: data.statusUpdates || [],
      },
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalInfographics: 1 } });

    res.json({
      success: true,
      project: {
        _id: project._id,
        title: project.title,
        template: project.template,
        metadata: project.metadata,
        status: project.status,
        createdAt: project.createdAt,
      },
    });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's project history
// @route   GET /api/infographic/history
const getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = '' } = req.query;
    const query = { userId: req.user._id };
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('title template status imageUrl createdAt metadata.meetingTitle metadata.date');

    res.json({
      success: true,
      projects,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/infographic/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project)
      return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/infographic/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!project)
      return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate share link
// @route   POST /api/infographic/:id/share
const shareProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project)
      return res.status(404).json({ success: false, message: 'Project not found' });

    if (!project.shareToken) {
      project.shareToken = uuidv4();
      await project.save();
    }

    const shareUrl = `${process.env.CLIENT_URL}/share/${project.shareToken}`;
    res.json({ success: true, shareUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    View shared project (public)
// @route   GET /api/infographic/share/:token
const getSharedProject = async (req, res) => {
  try {
    const project = await Project.findOne({ shareToken: req.params.token }).select('-userId -inputText');
    if (!project)
      return res.status(404).json({ success: false, message: 'Shared project not found' });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save infographic image URL (after client-side render + upload)
// @route   PUT /api/infographic/:id/image
const saveImageUrl = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { imageUrl },
      { new: true }
    );
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save newly generated infographic project
// @route   POST /api/infographic/save
const saveInfographic = async (req, res) => {
  try {
    const { title, template, theme, data } = req.body;

    const project = await Project.create({
      userId: req.user._id,
      title: title || 'Untitled Infographic',
      template: template,
      status: 'completed',
      metadata: {
        title: data.title,
        date: data.date,
        summary: data.summary,
        decisions: data.decisions,
        action_items: data.action_items,
        risks: data.risks,
        next_steps: data.next_steps
      }
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { totalInfographics: 1 } });

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  generateInfographic, getHistory, getProject, deleteProject, shareProject, getSharedProject, saveImageUrl,
  saveInfographic
};
