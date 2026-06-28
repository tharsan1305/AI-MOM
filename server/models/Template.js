const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Timeline', 'SWOT', 'Meeting Minutes'
  description: { type: String },
  thumbnailUrl: { type: String, default: 'https://via.placeholder.com/400x300?text=Template+Preview' },
  defaultTheme: { type: String, default: 'corporate' },
  isPremium: { type: Boolean, default: false },
  componentName: { type: String, required: true }, // Maps to the React layout component (e.g., 'action_board')
  useCase: { type: String }, // e.g., 'Best for agile sprint planning'
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);
