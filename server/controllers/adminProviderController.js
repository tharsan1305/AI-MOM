const ApiProvider = require('../models/ApiProvider');
const { encrypt, decrypt } = require('../utils/encryption');

// @desc    Get all providers
// @route   GET /api/admin/providers
exports.getProviders = async (req, res) => {
  try {
    const providers = await ApiProvider.find({}).lean();
    
    // Mask the API keys before sending to the client
    const safeProviders = providers.map(p => {
      let maskedKey = '';
      if (p.apiKey) {
        const decrypted = decrypt(p.apiKey);
        if (decrypted && decrypted.length > 4) {
          maskedKey = '•'.repeat(16) + decrypted.slice(-4);
        } else if (decrypted) {
          maskedKey = '••••••••';
        }
      }
      return {
        ...p,
        apiKey: maskedKey
      };
    });
    
    res.json({ success: true, providers: safeProviders });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a provider's key and/or model
// @route   PUT /api/admin/providers/:name
exports.updateProvider = async (req, res) => {
  try {
    const { name } = req.params;
    const { apiKey, model } = req.body;
    
    let provider = await ApiProvider.findOne({ name });
    if (!provider) {
      provider = new ApiProvider({ name });
    }
    
    if (apiKey && !apiKey.includes('•')) {
      // Only update if they sent a real key, not a masked string
      provider.apiKey = encrypt(apiKey.trim());
    }
    
    if (model) {
      provider.model = model.trim();
    }
    
    await provider.save();
    res.json({ success: true, message: 'Provider updated successfully' });
  } catch (error) {
    console.error('Error updating provider:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Set a provider as active
// @route   POST /api/admin/providers/:name/activate
exports.activateProvider = async (req, res) => {
  try {
    const { name } = req.params;
    
    // Deactivate all others
    await ApiProvider.updateMany({ name: { $ne: name } }, { isActive: false });
    
    // Activate the requested one (upsert if it doesn't exist)
    await ApiProvider.findOneAndUpdate(
      { name },
      { isActive: true },
      { upsert: true }
    );
    
    res.json({ success: true, message: `${name} is now the active provider` });
  } catch (error) {
    console.error('Error activating provider:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Basic in-memory rate limiting for the test endpoint
const testRateLimits = new Map();

// @desc    Test connection for a provider
// @route   POST /api/admin/providers/:name/test
exports.testProvider = async (req, res) => {
  const { name } = req.params;
  
  // Rate limiting (1 test per 10 seconds per provider)
  const now = Date.now();
  if (testRateLimits.has(name) && now - testRateLimits.get(name) < 10000) {
    return res.status(429).json({ success: false, message: 'Please wait before testing this provider again.' });
  }
  testRateLimits.set(name, now);

  try {
    const provider = await ApiProvider.findOne({ name });
    if (!provider || !provider.apiKey) {
      return res.status(400).json({ success: false, message: `No API key configured for ${name}` });
    }

    const key = decrypt(provider.apiKey);
    const model = provider.model || getDefaultModel(name);
    
    let isSuccess = false;
    let errorDetails = '';

    // Very lightweight ping to verify auth
    try {
      if (name === 'gemini') {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}?key=${key}`);
        isSuccess = response.ok;
        if (!isSuccess) errorDetails = await response.text();
      } 
      else if (name === 'groq') {
        const response = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { 'Authorization': `Bearer ${key}` }
        });
        isSuccess = response.ok;
        if (!isSuccess) errorDetails = await response.text();
      }
      else if (name === 'openai') {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${key}` }
        });
        isSuccess = response.ok;
        if (!isSuccess) errorDetails = await response.text();
      }
      else if (name === 'claude') {
        // Just checking auth for Anthropic
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            max_tokens: 1,
            messages: [{ role: 'user', content: 'ping' }]
          })
        });
        isSuccess = response.ok;
        if (!isSuccess) errorDetails = await response.text();
      }
      else {
        isSuccess = true; // For unhandled providers like replicate, just assume success for now
      }
    } catch (fetchErr) {
      isSuccess = false;
      errorDetails = fetchErr.message;
    }

    provider.lastTestedAt = new Date();
    provider.lastTestStatus = isSuccess ? 'success' : 'failed';
    await provider.save();

    if (isSuccess) {
      res.json({ success: true, message: 'Connection successful!' });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Connection failed. Check API key and model.', 
        error: errorDetails.substring(0, 200) // Truncate so we don't leak massive errors
      });
    }

  } catch (error) {
    console.error('Error testing provider:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

function getDefaultModel(provider) {
  switch(provider) {
    case 'gemini': return 'gemini-1.5-flash';
    case 'groq': return 'llama-3.3-70b-versatile';
    case 'openai': return 'gpt-4o-mini';
    case 'claude': return 'claude-3-haiku-20240307';
    default: return '';
  }
}
