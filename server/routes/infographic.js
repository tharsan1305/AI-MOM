const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  generateInfographic, getHistory, getProject,
  deleteProject, shareProject, getSharedProject, saveImageUrl,
  parseMeetingNotes, saveInfographic
} = require('../controllers/infographicController');

// Public
router.get('/share/:token', getSharedProject);

// Protected
router.post('/parse', protect, parseMeetingNotes);
router.post('/save', protect, saveInfographic);
router.post('/generate', protect, upload.single('file'), generateInfographic);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/share', protect, shareProject);
router.put('/:id/image', protect, saveImageUrl);

module.exports = router;
