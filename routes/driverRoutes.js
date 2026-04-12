const express = require('express');
const router = express.Router();
const { getDrivers, createDriver, updateDriver, toggleActiveDriver } = require('../controllers/driverController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getDrivers)
    .post(protect, createDriver);

router.route('/:id')
    .put(protect, updateDriver);

router.patch('/:id/toggle-active', protect, toggleActiveDriver);

module.exports = router;
