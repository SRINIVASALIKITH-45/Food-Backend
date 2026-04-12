const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/driverAuthController');
const { getAvailableOrders, acceptOrder, getMyDeliveries, updateStatusByDriver, toggleMyStatus, markArrived, verifyDelivery, getEarnings } = require('../controllers/driverController');
const authDriver = require('../middlewares/driverAuthMiddleware');

router.post('/login', login);
router.get('/profile', authDriver, getProfile);

// App routes
router.get('/orders/available', authDriver, getAvailableOrders);
router.post('/orders/:id/accept', authDriver, acceptOrder);
router.post('/orders/:id/status', authDriver, updateStatusByDriver);
router.post('/orders/:id/arrived', authDriver, markArrived);
router.post('/orders/:id/verify-otp', authDriver, verifyDelivery);
router.get('/deliveries', authDriver, getMyDeliveries);
router.get('/earnings', authDriver, getEarnings);
router.post('/status/toggle', authDriver, toggleMyStatus);

module.exports = router;
