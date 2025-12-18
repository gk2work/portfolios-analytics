const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.get('/portfolios/:portfolioId/tax-report', taxController.getTaxReport);
router.get('/portfolios/:portfolioId/tax-report/fy-wise', taxController.getFYWiseTaxReport);

module.exports = router;
