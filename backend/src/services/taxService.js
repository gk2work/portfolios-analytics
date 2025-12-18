const Holding = require('../models/Holding');
const Trade = require('../models/Trade');

/**
 * Calculate tax liability for a portfolio
 * Based on Indian tax rules for capital gains
 */
const calculateTax = async (portfolioId, financialYear = null) => {
    // Get current financial year if not specified
    const fy = financialYear || getCurrentFinancialYear();

    // Get all holdings and trades
    const holdings = await Holding.find({ portfolioId });
    const trades = await Trade.find({
        portfolioId,
        type: 'SELL'
    });

    // Calculate unrealized gains (current holdings)
    const unrealizedGains = calculateUnrealizedGains(holdings);

    // Calculate realized gains (from sell trades)
    const realizedGains = await calculateRealizedGains(portfolioId, trades, fy);

    // Calculate tax liability
    const taxLiability = calculateTaxLiability(realizedGains);

    return {
        financialYear: fy,
        unrealizedGains,
        realizedGains,
        taxLiability,
        summary: generateTaxSummary(realizedGains, taxLiability)
    };
};

/**
 * Calculate unrealized gains from current holdings
 */
const calculateUnrealizedGains = (holdings) => {
    const gains = {
        equity: { shortTerm: 0, longTerm: 0 },
        nonEquity: { shortTerm: 0, longTerm: 0 }
    };

    holdings.forEach(holding => {
        const holdingPeriod = getHoldingPeriod(holding.purchaseDate);
        const gain = holding.unrealizedPL;
        const isEquity = isEquityAsset(holding.assetType);

        if (isEquity) {
            if (holdingPeriod <= 365) {
                gains.equity.shortTerm += gain;
            } else {
                gains.equity.longTerm += gain;
            }
        } else {
            if (holdingPeriod <= 1095) { // 3 years for non-equity
                gains.nonEquity.shortTerm += gain;
            } else {
                gains.nonEquity.longTerm += gain;
            }
        }
    });

    return {
        equity: {
            shortTerm: parseFloat(gains.equity.shortTerm.toFixed(2)),
            longTerm: parseFloat(gains.equity.longTerm.toFixed(2))
        },
        nonEquity: {
            shortTerm: parseFloat(gains.nonEquity.shortTerm.toFixed(2)),
            longTerm: parseFloat(gains.nonEquity.longTerm.toFixed(2))
        }
    };
};

/**
 * Calculate realized gains from sell trades
 */
const calculateRealizedGains = async (portfolioId, sellTrades, financialYear) => {
    const gains = {
        equity: { shortTerm: 0, longTerm: 0, details: [] },
        nonEquity: { shortTerm: 0, longTerm: 0, details: [] }
    };

    // Get all buy trades to calculate cost basis
    const buyTrades = await Trade.find({
        portfolioId,
        type: 'BUY'
    }).sort({ tradeDate: 1 });

    // Process each sell trade
    for (const sellTrade of sellTrades) {
        // Find matching buy trades (FIFO method)
        const matchingBuys = buyTrades.filter(b => b.symbol === sellTrade.symbol);

        if (matchingBuys.length === 0) continue;

        let remainingQty = sellTrade.quantity;
        let totalCost = 0;
        let purchaseDate = matchingBuys[0].tradeDate;

        for (const buyTrade of matchingBuys) {
            if (remainingQty <= 0) break;

            const qtyToUse = Math.min(remainingQty, buyTrade.quantity);
            totalCost += qtyToUse * buyTrade.price;
            remainingQty -= qtyToUse;
        }

        const sellValue = sellTrade.quantity * sellTrade.price - sellTrade.charges;
        const gain = sellValue - totalCost;

        // Determine asset type
        const holding = await Holding.findOne({
            portfolioId,
            symbol: sellTrade.symbol
        });

        const assetType = holding ? holding.assetType : 'Equity';
        const isEquity = isEquityAsset(assetType);

        // Calculate holding period
        const holdingPeriod = getHoldingPeriod(purchaseDate, sellTrade.tradeDate);

        const gainDetail = {
            symbol: sellTrade.symbol,
            sellDate: sellTrade.tradeDate,
            purchaseDate,
            quantity: sellTrade.quantity,
            sellValue,
            costBasis: totalCost,
            gain: parseFloat(gain.toFixed(2)),
            holdingPeriod
        };

        if (isEquity) {
            if (holdingPeriod <= 365) {
                gains.equity.shortTerm += gain;
                gainDetail.type = 'STCG';
                gains.equity.details.push(gainDetail);
            } else {
                gains.equity.longTerm += gain;
                gainDetail.type = 'LTCG';
                gains.equity.details.push(gainDetail);
            }
        } else {
            if (holdingPeriod <= 1095) {
                gains.nonEquity.shortTerm += gain;
                gainDetail.type = 'STCG';
                gains.nonEquity.details.push(gainDetail);
            } else {
                gains.nonEquity.longTerm += gain;
                gainDetail.type = 'LTCG';
                gains.nonEquity.details.push(gainDetail);
            }
        }
    }

    return {
        equity: {
            shortTerm: parseFloat(gains.equity.shortTerm.toFixed(2)),
            longTerm: parseFloat(gains.equity.longTerm.toFixed(2)),
            details: gains.equity.details
        },
        nonEquity: {
            shortTerm: parseFloat(gains.nonEquity.shortTerm.toFixed(2)),
            longTerm: parseFloat(gains.nonEquity.longTerm.toFixed(2)),
            details: gains.nonEquity.details
        }
    };
};

/**
 * Calculate tax liability based on Indian tax rules
 * Note: These are approximate rates and may change
 */
const calculateTaxLiability = (realizedGains) => {
    const tax = {
        equity: { stcg: 0, ltcg: 0 },
        nonEquity: { stcg: 0, ltcg: 0 },
        total: 0
    };

    // Equity STCG: 15%
    if (realizedGains.equity.shortTerm > 0) {
        tax.equity.stcg = realizedGains.equity.shortTerm * 0.15;
    }

    // Equity LTCG: 10% above ₹1 lakh
    if (realizedGains.equity.longTerm > 100000) {
        tax.equity.ltcg = (realizedGains.equity.longTerm - 100000) * 0.10;
    }

    // Non-Equity STCG: As per income tax slab (assuming 30% for simplification)
    if (realizedGains.nonEquity.shortTerm > 0) {
        tax.nonEquity.stcg = realizedGains.nonEquity.shortTerm * 0.30;
    }

    // Non-Equity LTCG: 20% with indexation (simplified without indexation)
    if (realizedGains.nonEquity.longTerm > 0) {
        tax.nonEquity.ltcg = realizedGains.nonEquity.longTerm * 0.20;
    }

    tax.total = tax.equity.stcg + tax.equity.ltcg + tax.nonEquity.stcg + tax.nonEquity.ltcg;

    return {
        equity: {
            stcg: parseFloat(tax.equity.stcg.toFixed(2)),
            ltcg: parseFloat(tax.equity.ltcg.toFixed(2))
        },
        nonEquity: {
            stcg: parseFloat(tax.nonEquity.stcg.toFixed(2)),
            ltcg: parseFloat(tax.nonEquity.ltcg.toFixed(2))
        },
        total: parseFloat(tax.total.toFixed(2))
    };
};

/**
 * Generate FY-wise tax report
 */
const generateFYReport = async (portfolioId) => {
    const currentFY = getCurrentFinancialYear();
    const reports = [];

    // Generate reports for current and previous 2 FYs
    for (let i = 0; i < 3; i++) {
        const fy = `FY ${parseInt(currentFY.split(' ')[1]) - i}-${parseInt(currentFY.split(' ')[1]) - i + 1}`;
        const report = await calculateTax(portfolioId, fy);
        reports.push(report);
    }

    return reports;
};

/**
 * Helper: Get current financial year
 */
const getCurrentFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-11

    // Financial year in India: April to March
    if (month >= 3) { // April onwards
        return `FY ${year}-${year + 1}`;
    } else {
        return `FY ${year - 1}-${year}`;
    }
};

/**
 * Helper: Calculate holding period in days
 */
const getHoldingPeriod = (purchaseDate, sellDate = new Date()) => {
    const purchase = new Date(purchaseDate);
    const sell = new Date(sellDate);
    const diffTime = Math.abs(sell - purchase);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

/**
 * Helper: Check if asset is equity
 */
const isEquityAsset = (assetType) => {
    return assetType === 'Equity' || assetType === 'US Stock';
};

/**
 * Helper: Generate tax summary
 */
const generateTaxSummary = (realizedGains, taxLiability) => {
    const totalGains =
        realizedGains.equity.shortTerm +
        realizedGains.equity.longTerm +
        realizedGains.nonEquity.shortTerm +
        realizedGains.nonEquity.longTerm;

    return {
        totalRealizedGains: parseFloat(totalGains.toFixed(2)),
        totalTaxLiability: taxLiability.total,
        effectiveTaxRate: totalGains > 0
            ? parseFloat(((taxLiability.total / totalGains) * 100).toFixed(2))
            : 0,
        breakdown: {
            equitySTCG: {
                gains: realizedGains.equity.shortTerm,
                tax: taxLiability.equity.stcg,
                rate: '15%'
            },
            equityLTCG: {
                gains: realizedGains.equity.longTerm,
                tax: taxLiability.equity.ltcg,
                rate: '10% (above ₹1L)'
            },
            nonEquitySTCG: {
                gains: realizedGains.nonEquity.shortTerm,
                tax: taxLiability.nonEquity.stcg,
                rate: '30% (approx)'
            },
            nonEquityLTCG: {
                gains: realizedGains.nonEquity.longTerm,
                tax: taxLiability.nonEquity.ltcg,
                rate: '20%'
            }
        }
    };
};

module.exports = {
    calculateTax,
    generateFYReport,
    getCurrentFinancialYear
};
