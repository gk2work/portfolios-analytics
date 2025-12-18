const Portfolio = require('../models/Portfolio');
const taxService = require('../services/taxService');

/**
 * Get tax report for portfolio
 * GET /api/portfolios/:portfolioId/tax-report
 */
const getTaxReport = async (req, res, next) => {
    try {
        const { portfolioId } = req.params;
        const { financialYear } = req.query;

        // Verify portfolio belongs to user
        const portfolio = await Portfolio.findOne({
            _id: portfolioId,
            userId: req.userId
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const taxReport = await taxService.calculateTax(portfolioId, financialYear);

        res.json({
            portfolioId,
            portfolioName: portfolio.name,
            taxReport
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get FY-wise tax report
 * GET /api/portfolios/:portfolioId/tax-report/fy-wise
 */
const getFYWiseTaxReport = async (req, res, next) => {
    try {
        const { portfolioId } = req.params;

        // Verify portfolio belongs to user
        const portfolio = await Portfolio.findOne({
            _id: portfolioId,
            userId: req.userId
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const reports = await taxService.generateFYReport(portfolioId);

        res.json({
            portfolioId,
            portfolioName: portfolio.name,
            reports
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTaxReport,
    getFYWiseTaxReport
};
