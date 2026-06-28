/**
 * Pricing Helper for AI Models
 * Calculates estimated cost based on standard pricing tables (USD).
 */

const pricingTable = {
  'dall-e-3': {
    '1024x1024': { standard: 0.040, hd: 0.080 },
    '1024x1792': { standard: 0.080, hd: 0.120 },
    '1792x1024': { standard: 0.080, hd: 0.120 },
  },
  'dall-e-2': {
    '256x256': 0.016,
    '512x512': 0.018,
    '1024x1024': 0.020,
  }
};

const calculateImageCost = (model, size, quality = 'standard') => {
  if (model === 'dall-e-3') {
    return pricingTable['dall-e-3'][size]?.[quality] || 0.040;
  }
  if (model === 'dall-e-2') {
    return pricingTable['dall-e-2'][size] || 0.020;
  }
  return 0;
};

const calculateTokenCost = (model, inputTokens, outputTokens) => {
  // Simple token cost calculation stub (prices per 1k tokens)
  const textPricing = {
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'gemini-pro': { input: 0.000125, output: 0.000375 } // Assuming stub values
  };
  
  if (textPricing[model]) {
    const inputCost = (inputTokens / 1000) * textPricing[model].input;
    const outputCost = (outputTokens / 1000) * textPricing[model].output;
    return inputCost + outputCost;
  }
  return 0;
};

module.exports = { calculateImageCost, calculateTokenCost };
