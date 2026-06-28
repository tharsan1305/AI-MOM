const { GoogleGenAI } = require('@google/genai');
const Image = require('../models/Image');
const ApiCostTracking = require('../models/ApiCostTracking');
const ErrorLog = require('../models/ErrorLog');
const { checkPromptLimit, incrementPromptUsage } = require('../utils/promptLimiter');
const { createNotification } = require('../utils/notificationHelper');
const { calculateImageCost } = require('../utils/pricingHelper');
const { performance } = require('perf_hooks');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (!ai.interactions) {
  ai.interactions = {
    create: async (params) => {
      const res = await ai.models.generateContent({ model: params.model, contents: params.input });
      return { output_text: res.text };
    }
  };
}

// @desc    Generate image from text prompt
// @route   POST /api/images/generate
// @access  Private
const generateImage = async (req, res) => {
  let isRetry = false;
  let finalPrompt = req.body.prompt;
  let selectedSize = req.body.size || '1024x1024';
  
  try {
    if (!finalPrompt || finalPrompt.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a prompt with at least 3 characters.',
      });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key is not configured. Please add a valid key to your .env file.',
      });
    }

    // Validate size parameter
    const validSizes = ['1024x1024', '1024x1792', '1792x1024'];
    selectedSize = validSizes.includes(selectedSize) ? selectedSize : '1024x1024';
    
    // Check Prompt Limits
    const limitCheck = await checkPromptLimit(req.user._id);
    if (!limitCheck.allowed) {
      await createNotification('limit_exceeded', 'User Reached Prompt Limit', `User ${req.user.email} reached their limit of ${limitCheck.limit} prompts today.`, { userId: req.user._id });
      return res.status(429).json({
        success: false,
        message: limitCheck.message,
      });
    }

    // Call OpenAI DALL-E API
    const startTime = performance.now();
    let response;
    
    try {
      // Use free Pollinations.ai for image generation (no API key needed)
      const w = selectedSize.split('x')[0];
      const h = selectedSize.split('x')[1];
      const encodedPrompt = encodeURIComponent(finalPrompt.trim());
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${w}&height=${h}&nologo=true`;
      
      response = { data: [{ url: imageUrl }] };
    } catch (apiError) {
      if (apiError?.status === 400 || apiError?.code === 'content_policy_violation') {
        // Auto-sanitize and rewrite the prompt to be safe
        isRetry = true;
        const sanitizeRes = await ai.interactions.create({
          model: 'gemini-3.5-flash',
          input: `You are an AI safety expert. The user prompt was rejected for violating content policies. Rewrite the prompt so that it strictly adheres to safety guidelines while keeping the core creative intent. Output only the new prompt.\n\nUser prompt: ${finalPrompt}`
        });
        
        finalPrompt = sanitizeRes.output_text;
        
        const w = selectedSize.split('x')[0];
        const h = selectedSize.split('x')[1];
        const encodedPrompt = encodeURIComponent(finalPrompt.trim());
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${w}&height=${h}&nologo=true`;
        
        response = { data: [{ url: imageUrl }] };
      } else {
        throw apiError; // Throw other errors to the main catch block
      }
    }
    
    const endTime = performance.now();
    const generationTimeMs = endTime - startTime;

    const imageUrl = response.data[0].url;
    const estimatedCostUsd = calculateImageCost('dall-e-3', selectedSize, 'standard');
    const revisedPrompt = response.data[0].revised_prompt || finalPrompt;

    // Create tracking record
    await ApiCostTracking.create({
      userId: req.user._id,
      provider: 'pollinations',
      model: 'pollinations-free',
      endpoint: '/images/generations',
      imageCount: 1,
      generationTimeMs,
      estimatedCostUsd,
      status: 'success'
    });

    // Save to MongoDB
    const image = await Image.create({
      userId: req.user._id,
      prompt: finalPrompt.trim(),
      imageUrl,
      size: selectedSize,
      generationTimeMs,
      model: 'dall-e-3',
    });
    
    // Increment User's Prompt Usage
    await incrementPromptUsage(req.user._id);

    res.status(201).json({
      success: true,
      image: {
        _id: image._id,
        prompt: image.prompt,
        imageUrl: image.imageUrl,
        size: image.size,
        revisedPrompt,
        createdAt: image.createdAt,
      },
    });
  } catch (error) {
    console.error('Image Generation Error:', error);

    // Log the error
    await ErrorLog.create({
      userId: req.user ? req.user._id : null,
      type: error?.status === 429 ? 'rate_limit' : error?.code === 'insufficient_quota' ? 'quota' : 'api_error',
      provider: 'openai',
      message: error?.message || 'Unknown error occurred',
      endpoint: '/images/generations',
      stack: error?.stack
    });

    // Write failed cost tracking
    if (req.user) {
      await ApiCostTracking.create({
        userId: req.user._id,
        provider: 'pollinations',
        model: 'pollinations-free',
        endpoint: '/images/generations',
        generationTimeMs: 0,
        estimatedCostUsd: 0,
        status: 'failed',
        errorDetails: error?.message
      });
    }

    // Handle specific OpenAI errors
    if (error?.status === 400 || error?.code === 'content_policy_violation') {
      return res.status(400).json({
        success: false,
        message: 'Your prompt was rejected by the content policy. Please try a different prompt.',
      });
    }

    if (error?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OpenAI API key. Please check your configuration.',
      });
    }

    if (error?.status === 429) {
      await createNotification('error', 'API Rate Limit Exceeded', 'OpenAI API rate limit exceeded.', { error: error.message });
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Please wait a moment and try again.',
      });
    }

    if (error?.code === 'insufficient_quota') {
      await createNotification('error', 'API Quota Exceeded', 'OpenAI API quota exceeded.', { error: error.message });
      return res.status(402).json({
        success: false,
        message: 'OpenAI API quota exceeded. Please check your billing.',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate image. Please try again.',
    });
  }
};

// @desc    Get user's image generation history
// @route   GET /api/images/history
// @access  Private
const getImageHistory = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = '' } = req.query;
    const query = { userId: req.user._id };

    if (search) {
      query.prompt = { $regex: search, $options: 'i' };
    }

    const total = await Image.countDocuments(query);
    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select('prompt imageUrl size createdAt');

    res.json({
      success: true,
      images,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Image history error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single image
// @route   GET /api/images/:id
// @access  Private
const getImage = async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.id, userId: req.user._id });
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.json({ success: true, image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete generated image
// @route   DELETE /api/images/:id
// @access  Private
const deleteImage = async (req, res) => {
  try {
    const image = await Image.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's image generation stats
// @route   GET /api/images/stats
// @access  Private
const getImageStats = async (req, res) => {
  try {
    const totalImages = await Image.countDocuments({ userId: req.user._id });
    res.json({
      success: true,
      stats: { totalImages },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateImage, getImageHistory, getImage, deleteImage, getImageStats };
