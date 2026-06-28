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

// @desc    Parse raw meeting notes into structured JSON using GPT-4o-mini
// @route   POST /api/infographic/parse
const parseMeetingNotes = async (req, res) => {
  try {
    const { rawNotes } = req.body;
    if (!rawNotes) return res.status(400).json({ success: false, message: 'Meeting notes are required' });

    const startTime = performance.now();

    const systemPrompt = `You are an expert business analyst and copy editor. Analyze the meeting notes and perform the following Smart Improvements:
    1. Fix all grammar and spelling mistakes.
    2. Merge duplicate or highly similar action items.
    3. Generate a concise, professional Executive Summary.
    4. Highlight important decisions and detect any project risks.
    5. Identify the language of the input notes and return the entire JSON in THAT SAME LANGUAGE (e.g. if Tamil, return Tamil JSON values).

    Respond ONLY with valid JSON using the exact schema below:
    {
      "meetingType": "string",
      "top3Templates": ["premium_visual", "meeting_minutes", "action_board"],
      "data": {
        "title": "string",
        "date": "string",
        "executiveSummary": "string (2-3 sentences)",
        "attendees": ["string"],
        "agenda": ["string"],
        "discussionPoints": ["string"],
        "keyDecisions": ["string"],
        "actionItems": [
          { "task": "string", "owner": "string", "deadline": "string", "status": "string" }
        ],
        "risks": ["string"],
        "statusUpdates": ["string"]
      }
    }`;

    const interaction = await ai.interactions.create({
      model: 'gemini-3.5-flash',
      input: `${systemPrompt}\n\nUSER NOTES:\n${rawNotes}`
    });

    const endTime = performance.now();
    const generationTimeMs = endTime - startTime;

    const parsedJson = JSON.parse(interaction.output_text.replace(/```json/g, '').replace(/```/g, ''));
    
    if (!parsedJson || !parsedJson.data) {
      throw new Error('AI could not extract valid meeting data from your notes. Please ensure they contain actual meeting content.');
    }
    
    const inputTokens = 100;
    const outputTokens = 200;
    
    await ApiCostTracking.create({
      userId: req.user._id,
      provider: 'google',
      model: 'gemini-3.5-flash',
      endpoint: '/infographic/parse',
      inputTokens,
      outputTokens,
      totalTokens: response.usage.total_tokens,
      generationTimeMs,
      estimatedCostUsd: (inputTokens / 1000000) * 0.150 + (outputTokens / 1000000) * 0.600,
      status: 'success'
    });

    res.json({ success: true, parsedData: parsedJson, generationTimeMs });
  } catch (error) {
    console.error('Parse Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to parse meeting notes.' });
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
        meetingTitle: data.title,
        date: data.date,
        attendees: data.attendees,
        discussionPoints: data.discussionPoints,
        keyOutcomes: data.keyDecisions,
        actionItems: data.actionItems,
        risks: data.risks,
        agenda: data.agenda,
        executiveSummary: data.executiveSummary,
        theme: theme
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
  parseMeetingNotes, saveInfographic
};
