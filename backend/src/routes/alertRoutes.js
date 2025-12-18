const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

router.post('/', validate(schemas.createAlert), alertController.createAlert);
router.get('/', alertController.getAlerts);
router.get('/:id', alertController.getAlertById);
router.put('/:id', validate(schemas.updateAlert), alertController.updateAlert);
router.delete('/:id', alertController.deleteAlert);

// Manual alert evaluation (for testing)
router.post('/evaluate', alertController.evaluateAlerts);

module.exports = router;
