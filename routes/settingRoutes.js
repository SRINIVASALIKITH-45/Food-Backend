const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const rbac = require('../middlewares/rbac');
const {
    getSettings,
    updateSetting,
    getDeliveryZones,
    addDeliveryZone,
    deleteDeliveryZone,
    getAdminLogs
} = require('../controllers/SettingController');

router.get('/', getSettings);
router.put('/', protect, rbac(['Admin']), updateSetting);

router.get('/zones', protect, getDeliveryZones);
router.post('/zones', protect, rbac(['Admin']), addDeliveryZone);
router.delete('/zones/:id', protect, rbac(['Admin']), deleteDeliveryZone);

router.get('/logs', protect, rbac(['Admin']), getAdminLogs);

module.exports = router;
