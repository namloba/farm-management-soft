const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', farmController.getAllFarms);
router.get('/:id', farmController.getFarmById);
router.post('/', farmController.createFarm);
router.put('/:id', farmController.updateFarm);
router.delete('/:id', farmController.deleteFarm);

module.exports = router;