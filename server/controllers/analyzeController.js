const { GoogleGenAI } = require('@google/genai');
const { analyzeWithGroq } = require('../services/groqService');
const { analyzeWithOpenAI } = require('../services/openaiService');
const { analyzeWithClaude } = require('../services/claudeService');
const ApiProvider = require('../models/ApiProvider');
const PromptLog = require('../models/PromptLog');
const { decrypt } = require('../utils/encryption');

// Simple in-memory cache for the active provider
let activeProviderCache = null;
let providerCacheTimestamp = 0;
const CACHE_TTL = 60000; // 60 seconds

const getActiveProvider = async () => {
  const now = Date.now();
  if (activeProviderCache && (now - providerCacheTimestamp < CACHE_TTL)) {
    return activeProviderCache;
  }
  
  const provider = await ApiProvider.findOne({ isActive: true });
  if (provider) {
    activeProviderCache = {
      name: provider.name,
      apiKey: decrypt(provider.apiKey),
      model: provider.model
    };
    providerCacheTimestamp = now;
  } else {
    // Fallback if DB not configured yet, use .env (transitional state)
    activeProviderCache = {
      name: process.env.AI_PROVIDER || 'gemini',
      apiKey: process.env.AI_PROVIDER === 'groq' ? process.env.GROQ_API_KEY : process.env.GEMINI_API_KEY,
      model: ''
    };
    providerCacheTimestamp = now;
  }
  return activeProviderCache;
};

// @desc    Analyze meeting notes according to new strict JSON schema
// @route   POST /api/infographic/analyze
const analyzeMeetingNotes = async (req, res) => {
  try {
    const { rawNotes } = req.body;
    if (!rawNotes || rawNotes.trim().length < 20) {
      return res.status(400).json({ success: false, message: 'Notes must be at least 20 characters long.' });
    }

    const systemPrompt = `You are a meeting analysis assistant. Given raw, unstructured meeting notes, extract structured information. Respond with ONLY valid JSON, no markdown formatting, no explanation, no code fences — matching exactly this schema:
{
  "title": "string",
  "date": "string",
  "attendees": ["string"],
  "summary": "string (1 sentence)",
  "decisions": ["string"],
  "action_items": [{ "task": "string", "owner": "string | null", "deadline": "string | null" }],
  "risks": ["string"],
  "next_steps": ["string"]
}
If any field isn't mentioned in the notes, use null for strings or an empty array for lists. Do not invent information that isn't in the notes. For 'attendees', extract names of people mentioned as present or participating in the meeting (not just task owners). If no attendees are explicitly mentioned, return an empty array.`;

    let outputText = '';
    const activeProvider = await getActiveProvider();
    
    if (!activeProvider.apiKey) {
      return res.status(500).json({ success: false, message: `API key for active provider (${activeProvider.name}) is missing.` });
    }

    if (activeProvider.name === 'groq') {
      outputText = await analyzeWithGroq(rawNotes, systemPrompt, activeProvider.apiKey, activeProvider.model || 'llama-3.3-70b-versatile');
    } else if (activeProvider.name === 'openai') {
      outputText = await analyzeWithOpenAI(rawNotes, systemPrompt, activeProvider.apiKey, activeProvider.model || 'gpt-4o-mini');
    } else if (activeProvider.name === 'claude') {
      outputText = await analyzeWithClaude(rawNotes, systemPrompt, activeProvider.apiKey, activeProvider.model || 'claude-3-haiku-20240307');
    } else {
      // Default / Gemini
      console.log('Sending request to Gemini...');
      const startTime = Date.now();
      
      const ai = new GoogleGenAI({ apiKey: activeProvider.apiKey });
      if (!ai.interactions) {
        ai.interactions = {
          create: async (params) => {
            const res = await ai.models.generateContent({ model: params.model, contents: params.input });
            return { output_text: res.text };
          }
        };
      }

      let timeoutId;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('TIMEOUT')), 60000);
      });

      const interactionPromise = ai.interactions.create({
        model: activeProvider.model || 'gemini-1.5-flash',
        input: `${systemPrompt}\n\nRAW NOTES:\n${rawNotes}`
      });

      const interaction = await Promise.race([interactionPromise, timeoutPromise]);
      clearTimeout(timeoutId);
      
      console.log(`Gemini responded in ${Date.now() - startTime}ms`);
      outputText = interaction.output_text;
    }

    // Strip out markdown code fences
    let content = outputText.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw output:", content);
      
      // Log parsing error
      await PromptLog.create({
        userId: req.user ? req.user._id : null,
        rawNotes,
        aiProvider: activeProvider.name,
        aiModel: activeProvider.model || 'default',
        status: 'failed',
        errorMessage: 'Invalid JSON format returned by AI',
      });

      return res.status(500).json({ success: false, message: 'The AI model returned an invalid format. Please try again.' });
    }

    // Log success
    await PromptLog.create({
      userId: req.user ? req.user._id : null,
      rawNotes,
      jsonOutput: parsedData,
      aiProvider: activeProvider.name,
      aiModel: activeProvider.model || 'default',
      status: 'success'
    });

    res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Analyze API Error:', error);
    
    let errorMessage = error.message || 'Failed to communicate with AI.';
    let statusCode = 500;

    if (error.message === 'TIMEOUT') {
      statusCode = 504;
      errorMessage = 'The AI service is taking too long to respond. Please try again.';
    } else if (error.status === 429 || error.status === 503 || (error.message && error.message.includes('429'))) {
      statusCode = error.status || 429;
      errorMessage = 'AI service is temporarily busy, please try again in a minute.';
    }

    // Log the failure if activeProvider is known (i.e. didn't fail at getActiveProvider)
    // We'll wrap in try-catch in case it fails early
    try {
      const p = await getActiveProvider();
      await PromptLog.create({
        userId: req.user ? req.user._id : null,
        rawNotes: req.body.rawNotes || '',
        aiProvider: p ? p.name : 'unknown',
        aiModel: p ? (p.model || 'default') : 'unknown',
        status: 'failed',
        errorMessage
      });
    } catch(err) {
      console.error('Failed to write to PromptLog', err);
    }

    res.status(statusCode).json({ success: false, message: errorMessage });
  }
};

module.exports = { analyzeMeetingNotes };
