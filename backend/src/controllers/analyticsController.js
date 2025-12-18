const Portfolio = require('../models/Portfolio');
const analyticsService = require('../services/analyticsService');

/**
 * Get portfolio analytics
 * GET /api/portfolios/:portfolioId/analytics
 */
const getPortfolioAnalytics = async (req, res, next) => {
    try {
        const { portfolioId } = req.params;
        const { benchmark } = req.query;

        // Verify portfolio belongs to user
        const portfolio = await Portfolio.findOne({
            _id: portfolioId,
            userId: req.userId
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        // Calculate metrics
        const metrics = await analyticsService.calculatePortfolioMetrics(portfolioId);

        // Get benchmark comparison if requested
        let benchmarkComparison = null;
        if (benchmark) {
            benchmarkComparison = await analyticsService.compareToBenchmark(
                portfolioId,
                benchmark.toUpperCase()
            );
        }

        res.json({
            portfolioId,
            portfolioName: portfolio.name,
            metrics,
            benchmarkComparison
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get benchmark comparison
 * GET /api/portfolios/:portfolioId/analytics/benchmark
 */
const getBenchmarkComparison = async (req, res, next) => {
    try {
        const { portfolioId } = req.params;
        const { benchmark = 'NIFTY50', days = 30 } = req.query;

        // Verify portfolio belongs to user
        const portfolio = await Portfolio.findOne({
            _id: portfolioId,
            userId: req.userId
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const comparison = await analyticsService.compareToBenchmark(
            portfolioId,
            benchmark.toUpperCase(),
            parseInt(days)
        );

        res.json({
            portfolioId,
            portfolioName: portfolio.name,
            comparison
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPortfolioAnalytics,
    getBenchmarkComparison
};
