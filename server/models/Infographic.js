const mongoose = require('mongoose');

const infographicSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  meetingType: { type: String, required: true }, // e.g., 'Sprint Review', 'Client Meeting'
  template: { type: String, required: true }, // 'Meeting Minutes', 'Timeline', etc.
  theme: { type: String, default: 'modern' }, // 'corporate', 'modern', 'minimal', 'dark'
  
  // The structured extracted data from OpenAI
  data: {
    title: { type: String },
    date: { type: String },
    attendees: [{ type: String }],
    agenda: [{ type: String }],
    discussionPoints: [{ type: String }],
    keyDecisions: [{ type: String }],
    actionItems: [{
      task: { type: String },
      owner: { type: String },
      deadline: { type: String },
      status: { type: String }
    }],
    budget: { type: String },
    risks: [{ type: String }],
    nextMeeting: { type: String },
  },
  
  // Analytics
  downloads: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  regenerationCount: { type: Number, default: 0 },
  
  // Performance
  generationTimeMs: { type: Number, default: 0 },
  
  // Storage for rendered thumbnail/preview if we choose to save it via html2canvas later
  thumbnailUrl: { type: String },
  
}, { timestamps: true });

module.exports = mongoose.model('Infographic', infographicSchema);
