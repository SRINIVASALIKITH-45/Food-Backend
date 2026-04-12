const express = require('express');
const router = express.Router();
const { 
    getProducts, createProduct, updateProduct, deleteProduct, 
    toggleAvailability, getTags, toggleFavorite, getFavorites, addReview 
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../config/multer');

router.route('/')
    .get(getProducts)
    .post(protect, upload.single('image'), createProduct);

router.get('/favorites', protect, getFavorites);
router.post('/reviews', protect, addReview);

router.route('/:id')
    .put(protect, upload.single('image'), updateProduct)
    .delete(protect, deleteProduct);

router.post('/:id/toggle-favorite', protect, toggleFavorite);

router.get('/get-tags', getTags);

router.patch('/:id/toggle-availability', protect, toggleAvailability);

module.exports = router;
