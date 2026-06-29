const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  inputText: { type: String },
  inputType: {
    type: String,
    enum: ['meeting_minutes', 'project_review', 'weekly_report', 'sprint_review', 'workshop_notes', 'event_summary'],
    default: 'meeting_minutes'
  },
  template: {
    type: String,
    default: 'meeting_report'
  },
  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
  imageUrl: { type: String, default: '' },
  shareToken: { type: String, unique: true, sparse: true },
  metadata: {
    title: String,
    date: String,
    summary: String,
    decisions: [String],
    action_items: [{
      task: String,
      owner: String,
      deadline: String
    }],
    risks: [String],
    next_steps: [String],
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
