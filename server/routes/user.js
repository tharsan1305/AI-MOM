const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, changePassword, getStats, getBillingDetails, cancelSubscription } = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.get('/stats', protect, getStats);
router.get('/billing', protect, getBillingDetails);
router.post('/subscription/cancel', protect, cancelSubscription);

module.exports = router;
