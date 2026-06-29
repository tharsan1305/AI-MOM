const mongoose = require('mongoose');

const apiProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['openai', 'gemini', 'claude', 'groq', 'replicate']
  },
  apiKey: {
    type: String,
    // Optional because the user might just be updating the active status or model
    // without initially providing a key, though ideally it should have one to work.
  },
  isActive: {
    type: Boolean,
    default: false
  },
  model: {
    type: String,
    // e.g. "llama-3.3-70b-versatile", "gemini-1.5-flash"
  },
  lastTestedAt: {
    type: Date,
    default: null
  },
  lastTestStatus: {
    type: String,
    enum: ['success', 'failed', 'untested'],
    default: 'untested'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ApiProvider', apiProviderSchema);
