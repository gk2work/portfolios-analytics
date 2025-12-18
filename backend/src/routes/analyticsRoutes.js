const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.get('/portfolios/:portfolioId/analytics', analyticsController.getPortfolioAnalytics);
router.get('/portfolios/:portfolioId/analytics/benchmark', analyticsController.getBenchmarkComparison);

module.exports = router;
