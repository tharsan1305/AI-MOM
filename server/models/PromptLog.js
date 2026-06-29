const mongoose = require('mongoose');

const promptLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest
  rawNotes: { type: String, required: true },
  jsonOutput: { type: mongoose.Schema.Types.Mixed }, // The parsed JSON object if successful
  aiProvider: { type: String, required: true },
  aiModel: { type: String, required: true },
  status: { type: String, enum: ['success', 'failed'], required: true },
  errorMessage: { type: String },
  generationTimeMs: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('PromptLog', promptLogSchema);
