const Portfolio = require('../models/Portfolio');

/**
 * Create new portfolio
 * POST /api/portfolios
 */
const createPortfolio = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const portfolio = new Portfolio({
            userId: req.userId,
            name,
            description: description || ''
        });

        await portfolio.save();

        res.status(201).json({
            message: 'Portfolio created successfully',
            portfolio
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all portfolios for user
 * GET /api/portfolios
 */
const getPortfolios = async (req, res, next) => {
    try {
        const portfolios = await Portfolio.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.json({
            count: portfolios.length,
            portfolios
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single portfolio
 * GET /api/portfolios/:id
 */
const getPortfolioById = async (req, res, next) => {
    try {
        const portfolio = await Portfolio.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        res.json({ portfolio });
    } catch (error) {
        next(error);
    }
};

/**
 * Update portfolio
 * PUT /api/portfolios/:id
 */
const updatePortfolio = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const portfolio = await Portfolio.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        if (name) portfolio.name = name;
        if (description !== undefined) portfolio.description = description;

        await portfolio.save();

        res.json({
            message: 'Portfolio updated successfully',
            portfolio
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete portfolio
 * DELETE /api/portfolios/:id
 */
const deletePortfolio = async (req, res, next) => {
    try {
        const portfolio = await Portfolio.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        // Also delete all holdings and trades for this portfolio
        const Holding = require('../models/Holding');
        const Trade = require('../models/Trade');

        await Holding.deleteMany({ portfolioId: portfolio._id });
        await Trade.deleteMany({ portfolioId: portfolio._id });
        await portfolio.deleteOne();

        res.json({
            message: 'Portfolio and all associated data deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPortfolio,
    getPortfolios,
    getPortfolioById,
    updatePortfolio,
    deletePortfolio
};
