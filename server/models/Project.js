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
    enum: ['corporate', 'timeline', 'mind_map', 'flowchart', 'modern_business', 'linkedin'],
    default: 'corporate'
  },
  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
  imageUrl: { type: String, default: '' },
  shareToken: { type: String, unique: true, sparse: true },
  metadata: {
    meetingTitle: String,
    date: String,
    attendees: [String],
    discussionPoints: [String],
    keyOutcomes: [String],
    actionItems: [{
      task: String,
      assignee: String,
      deadline: String,
      status: { type: String, default: 'pending' }
    }],
    risks: [String],
    nextSteps: [String],
    statusUpdates: [String],
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
