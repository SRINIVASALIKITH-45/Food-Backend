const express = require('express');
const router = express.Router();
const { getTables, updateTableStatus, mergeTables } = require('../controllers/tableController');
const authWriter = require('../middlewares/writerAuthMiddleware');

router.get('/', getTables); // Public or Writer accessible
router.patch('/:id/status', authWriter, updateTableStatus);
router.post('/merge', authWriter, mergeTables);

module.exports = router;
