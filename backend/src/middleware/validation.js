const Joi = require('joi');

/**
 * Validation middleware factory
 * Creates middleware that validates request body against a Joi schema
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            });
        }

        req.body = value;
        next();
    };
};

// Validation schemas
const schemas = {
    // Auth schemas
    register: Joi.object({
        name: Joi.string().required().trim().min(2).max(50),
        email: Joi.string().required().email().lowercase(),
        password: Joi.string().required().min(6).max(100),
        riskPreference: Joi.string().valid('conservative', 'moderate', 'aggressive').default('moderate')
    }),

    login: Joi.object({
        email: Joi.string().required().email().lowercase(),
        password: Joi.string().required()
    }),

    updateProfile: Joi.object({
        name: Joi.string().trim().min(2).max(50),
        riskPreference: Joi.string().valid('conservative', 'moderate', 'aggressive')
    }),

    // Portfolio schemas
    createPortfolio: Joi.object({
        name: Joi.string().required().trim().min(1).max(100),
        description: Joi.string().trim().max(500).allow('')
    }),

    updatePortfolio: Joi.object({
        name: Joi.string().trim().min(1).max(100),
        description: Joi.string().trim().max(500).allow('')
    }),

    // Holding schemas
    createHolding: Joi.object({
        symbol: Joi.string().required().uppercase().trim(),
        name: Joi.string().trim().allow(''),
        assetType: Joi.string().required().valid('Equity', 'Mutual Fund', 'Crypto', 'US Stock'),
        quantity: Joi.number().required().min(0.001),
        avgPrice: Joi.number().required().min(0),
        currentPrice: Joi.number().min(0).default(0),
        sector: Joi.string().trim().default('Other'),
        purchaseDate: Joi.date().default(Date.now)
    }),

    updateHolding: Joi.object({
        symbol: Joi.string().uppercase().trim(),
        name: Joi.string().trim().allow(''),
        assetType: Joi.string().valid('Equity', 'Mutual Fund', 'Crypto', 'US Stock'),
        quantity: Joi.number().min(0.001),
        avgPrice: Joi.number().min(0),
        currentPrice: Joi.number().min(0),
        sector: Joi.string().trim(),
        purchaseDate: Joi.date()
    }),

    // Alert schemas
    createAlert: Joi.object({
        symbol: Joi.string().required().uppercase().trim(),
        alertType: Joi.string().required().valid('PRICE_BREAKOUT', 'VOLUME_SPIKE', 'RSI', 'PERCENT_MOVE'),
        conditions: Joi.object({
            targetPrice: Joi.number().min(0),
            direction: Joi.string().valid('ABOVE', 'BELOW'),
            volumeThreshold: Joi.number().min(0),
            rsiLevel: Joi.number().min(0).max(100),
            rsiCondition: Joi.string().valid('OVERBOUGHT', 'OVERSOLD'),
            percentChange: Joi.number(),
            timeframe: Joi.string().valid('1D', '1W', '1M')
        }).required(),
        notificationPreferences: Joi.object({
            email: Joi.boolean().default(true),
            inApp: Joi.boolean().default(true)
        })
    }),

    updateAlert: Joi.object({
        conditions: Joi.object({
            targetPrice: Joi.number().min(0),
            direction: Joi.string().valid('ABOVE', 'BELOW'),
            volumeThreshold: Joi.number().min(0),
            rsiLevel: Joi.number().min(0).max(100),
            rsiCondition: Joi.string().valid('OVERBOUGHT', 'OVERSOLD'),
            percentChange: Joi.number(),
            timeframe: Joi.string().valid('1D', '1W', '1M')
        }),
        status: Joi.string().valid('ACTIVE', 'TRIGGERED', 'DISABLED'),
        notificationPreferences: Joi.object({
            email: Joi.boolean(),
            inApp: Joi.boolean()
        })
    })
};

module.exports = { validate, schemas };
