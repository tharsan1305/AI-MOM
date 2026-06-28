const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getBrandKit, updateBrandKit } = require('../controllers/brandController');

router.use(protect);
router.route('/').get(getBrandKit).put(updateBrandKit);

module.exports = router;
