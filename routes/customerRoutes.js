const express = require('express');
const router = express.Router();
const { getCustomers, updateCustomer, toggleBlockCustomer } = require('../controllers/customerController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getCustomers);

router.route('/:id')
    .put(protect, updateCustomer);

router.patch('/:id/toggle-block', protect, toggleBlockCustomer);

module.exports = router;
