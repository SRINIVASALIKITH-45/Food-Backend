const express = require('express');
const router = express.Router();
const { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getCoupons)
    .post(protect, createCoupon);

router.post('/validate', protect, validateCoupon);

router.route('/:id')
    .put(protect, updateCoupon)
    .delete(protect, deleteCoupon);

module.exports = router;
