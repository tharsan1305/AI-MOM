const mongoose = require('mongoose');

const meetingTopicSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: { type: String, required: true, index: true }, // 'Business', 'Marketing', etc.
  frequency: { type: Number, default: 1 },
  sourceContentId: { type: mongoose.Schema.Types.ObjectId }, // Link to infographic/notes
}, { timestamps: true });

module.exports = mongoose.model('MeetingTopic', meetingTopicSchema);
