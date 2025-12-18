const express = require('express');
const router = express.Router();
const holdingController = require('../controllers/holdingController');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

// Holdings for specific portfolio
router.post(
    '/portfolios/:portfolioId/holdings',
    validate(schemas.createHolding),
    holdingController.addHolding
);

router.get('/portfolios/:portfolioId/holdings', holdingController.getHoldings);

router.post(
    '/portfolios/:portfolioId/holdings/import',
    holdingController.upload.single('file'),
    holdingController.importHoldingsCSV
);

// Individual holding operations
router.put('/:id', validate(schemas.updateHolding), holdingController.updateHolding);
router.delete('/:id', holdingController.deleteHolding);

module.exports = router;
