const express = require('express');
const router = express.Router();
const { createKOT, getKOTsByTable, updateKOTStatus, getActiveKOTs } = require('../controllers/kotController');
const authWriter = require('../middlewares/writerAuthMiddleware');

router.post('/', authWriter, createKOT);
router.get('/active', getActiveKOTs);
router.get('/table/:table_id', getKOTsByTable);
router.patch('/:id/status', updateKOTStatus);

module.exports = router;
