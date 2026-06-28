const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  generateImage,
  getImageHistory,
  getImage,
  deleteImage,
  getImageStats,
} = require('../controllers/imageController');

// All routes require authentication
router.use(protect);

router.post('/generate', generateImage);
router.get('/history', getImageHistory);
router.get('/stats', getImageStats);
router.get('/:id', getImage);
router.delete('/:id', deleteImage);

module.exports = router;
