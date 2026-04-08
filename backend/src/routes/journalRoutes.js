const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { authenticate } = require('../middleware/auth');

// Tất cả routes đều cần xác thực
router.use(authenticate);

// Routes
router.get('/zone/:zoneId', journalController.getJournalByZone);
router.get('/zone/:zoneId/stats', journalController.getJournalStats);
router.get('/:id', journalController.getJournalById);
router.post('/', journalController.createJournal);
router.put('/:id', journalController.updateJournal);
router.delete('/:id', journalController.deleteJournal);

module.exports = router;