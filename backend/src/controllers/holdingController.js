const Holding = require('../models/Holding');
const Portfolio = require('../models/Portfolio');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Configure multer for CSV upload
const upload = multer({ dest: 'uploads/' });

/**
 * Add holding to portfolio
 * POST /api/portfolios/:portfolioId/holdings
 */
const addHolding = async (req, res, next) => {
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

        const holding = new Holding({
            portfolioId,
            ...req.body
        });

        await holding.save();

        res.status(201).json({
            message: 'Holding added successfully',
            holding
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all holdings for portfolio
 * GET /api/portfolios/:portfolioId/holdings
 */
const getHoldings = async (req, res, next) => {
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

        const holdings = await Holding.find({ portfolioId })
            .sort({ currentValue: -1 });

        res.json({
            count: holdings.length,
            holdings
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update holding
 * PUT /api/holdings/:id
 */
const updateHolding = async (req, res, next) => {
    try {
        const holding = await Holding.findById(req.params.id).populate('portfolioId');

        if (!holding) {
            return res.status(404).json({ error: 'Holding not found' });
        }

        // Verify portfolio belongs to user
        const portfolio = await Portfolio.findOne({
            _id: holding.portfolioId,
            userId: req.userId
        });

        if (!portfolio) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Update fields
        const allowedFields = ['symbol', 'name', 'assetType', 'quantity', 'avgPrice', 'currentPrice', 'sector', 'purchaseDate'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                holding[field] = req.body[field];
            }
        });

        await holding.save();

        res.json({
            message: 'Holding updated successfully',
            holding
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete holding
 * DELETE /api/holdings/:id
 */
const deleteHolding = async (req, res, next) => {
    try {
        const holding = await Holding.findById(req.params.id);

        if (!holding) {
            return res.status(404).json({ error: 'Holding not found' });
        }

        // Verify portfolio belongs to user
        const portfolio = await Portfolio.findOne({
            _id: holding.portfolioId,
            userId: req.userId
        });

        if (!portfolio) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await holding.deleteOne();

        res.json({
            message: 'Holding deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Import holdings from CSV
 * POST /api/portfolios/:portfolioId/holdings/import
 */
const importHoldingsCSV = async (req, res, next) => {
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

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const holdings = [];
        const errors = [];

        // Parse CSV file
        await new Promise((resolve, reject) => {
            fs.createReadStream(req.file.path)
                .pipe(csv())
                .on('data', (row) => {
                    try {
                        // Expected CSV format: symbol,name,assetType,quantity,avgPrice,sector,purchaseDate
                        const holding = {
                            portfolioId,
                            symbol: row.symbol?.toUpperCase().trim(),
                            name: row.name?.trim() || '',
                            assetType: row.assetType?.trim() || 'Equity',
                            quantity: parseFloat(row.quantity),
                            avgPrice: parseFloat(row.avgPrice),
                            currentPrice: parseFloat(row.currentPrice) || 0,
                            sector: row.sector?.trim() || 'Other',
                            purchaseDate: row.purchaseDate ? new Date(row.purchaseDate) : new Date()
                        };

                        // Validate
                        if (!holding.symbol || !holding.quantity || !holding.avgPrice) {
                            errors.push(`Invalid row: ${JSON.stringify(row)}`);
                        } else {
                            holdings.push(holding);
                        }
                    } catch (err) {
                        errors.push(`Error parsing row: ${err.message}`);
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Delete uploaded file
        fs.unlinkSync(req.file.path);

        if (holdings.length === 0) {
            return res.status(400).json({
                error: 'No valid holdings found in CSV',
                errors
            });
        }

        // Insert holdings
        const insertedHoldings = await Holding.insertMany(holdings);

        res.status(201).json({
            message: `${insertedHoldings.length} holdings imported successfully`,
            count: insertedHoldings.length,
            holdings: insertedHoldings,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        // Clean up file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        next(error);
    }
};

module.exports = {
    addHolding,
    getHoldings,
    updateHolding,
    deleteHolding,
    importHoldingsCSV,
    upload // Export multer middleware
};
