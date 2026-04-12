const express = require('express');
const router = express.Router();
const { login, getProfile, updateProfile } = require('../controllers/kitchenAuthController');
const authKitchen = require('../middlewares/kitchenAuthMiddleware');

router.post('/login', login);
router.get('/profile', authKitchen, getProfile);
router.patch('/profile', authKitchen, updateProfile);

module.exports = router;
