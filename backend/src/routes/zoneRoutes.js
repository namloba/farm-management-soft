const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');
const { authenticate } = require('../middleware/auth');

// Tất cả routes đều cần xác thực
router.use(authenticate);

// Routes
router.get('/', zoneController.getAllZones);
router.get('/:id', zoneController.getZoneById);
router.post('/', zoneController.createZone);
router.put('/:id', zoneController.updateZone);
router.delete('/:id', zoneController.deleteZone);

module.exports = router;