const express = require('express');
const router = express.Router();
const { login, toggleDuty, getProfile, updateProfile } = require('../controllers/writerAuthController');
const authWriter = require('../middlewares/writerAuthMiddleware');

router.post('/login', login);
router.get('/profile', authWriter, getProfile);
router.patch('/profile', authWriter, updateProfile);
router.patch('/toggle-duty', authWriter, toggleDuty);

module.exports = router;
