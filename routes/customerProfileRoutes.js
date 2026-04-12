const express = require('express');
const router = express.Router();
const { getProfileStats, getAddresses, getPaymentMethods, addAddress, addPaymentMethod } = require('../controllers/customerProfileController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/stats', protect, getProfileStats);
router.get('/addresses', protect, getAddresses);
router.get('/payment-methods', protect, getPaymentMethods);
router.post('/addresses', protect, addAddress);
router.post('/payment-methods', protect, addPaymentMethod);

module.exports = router;
