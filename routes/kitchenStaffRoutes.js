const express = require('express');
const router = express.Router();
const { getKitchenStaff, createKitchenStaff, updateKitchenStaff, toggleActiveKitchenStaff } = require('../controllers/kitchenStaffController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getKitchenStaff);
router.post('/', protect, createKitchenStaff);
router.put('/:id', protect, updateKitchenStaff);
router.patch('/:id/toggle-active', protect, toggleActiveKitchenStaff);

module.exports = router;

