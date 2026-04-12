const express = require('express');
const router = express.Router();
const {
    createOrder, getOrders, getOrderById, updateOrderStatus,
    generateInvoice, getMyOrders, createCustomerOrder, generateDineInBill
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// Admin routes
router.route('/')
    .get(protect, getOrders)
    .post(protect, createOrder);

// Customer routes (use same protect middleware — customer token is valid JWT)
router.get('/my-orders', protect, getMyOrders);
router.post('/customer', protect, createCustomerOrder);

router.post('/dine-in/generate', protect, generateDineInBill);

router.route('/:id')
    .get(protect, getOrderById)
    .put(protect, updateOrderStatus);

router.get('/:id/generate-invoice', protect, generateInvoice);

module.exports = router;

