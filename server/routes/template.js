const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getTemplates,
  toggleFavorite,
  adminGetTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
} = require('../controllers/templateController');

// Public/User Routes
router.get('/', getTemplates);
router.post('/:id/favorite', protect, toggleFavorite);

// Admin Routes
router.get('/admin', protect, admin, adminGetTemplates);
router.post('/', protect, admin, createTemplate);
router.put('/:id', protect, admin, updateTemplate);
router.delete('/:id', protect, admin, deleteTemplate);

module.exports = router;
