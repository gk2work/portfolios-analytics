const Holding = require('../models/Holding');
const Trade = require('../models/Trade');
const marketDataService = require('./marketDataService');

/**
 * Calculate portfolio analytics
 * @param {string} portfolioId - Portfolio ID
 * @returns {Object} Complete analytics object
 */
const calculatePortfolioMetrics = async (portfolioId) => {
    // Get all holdings for the portfolio
    const holdings = await Holding.find({ portfolioId });

    if (holdings.length === 0) {
        return getEmptyMetrics();
    }

    // Update current prices
    for (let holding of holdings) {
        holding.currentPrice = marketDataService.getCurrentPrice(holding.symbol);
        await holding.save();
    }

    // Reload holdings to get virtual fields
    const updatedHoldings = await Holding.find({ portfolioId });

    // Calculate basic metrics
    const totalInvested = updatedHoldings.reduce((sum, h) => sum + h.investedValue, 0);
    const currentValue = updatedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const unrealizedPL = currentValue - totalInvested;
    const unrealizedPLPercent = totalInvested > 0 ? ((unrealizedPL / totalInvested) * 100).toFixed(2) : 0;

    // Calculate realized P&L from trades
    const realizedPL = await calculateRealizedPL(portfolioId);

    // Calculate day P&L (simplified - using 1% random change for demo)
    const dayPL = currentValue * (Math.random() - 0.5) * 0.02;
    const dayPLPercent = currentValue > 0 ? ((dayPL / currentValue) * 100).toFixed(2) : 0;

    // Calculate CAGR
    const cagr = calculateCAGR(updatedHoldings, totalInvested, currentValue);

    // Calculate XIRR (simplified version)
    const xirr = calculateXIRR(updatedHoldings, totalInvested, currentValue);

    // Calculate drawdown
    const drawdown = await calculateDrawdown(portfolioId);

    // Calculate volatility
    const volatility = await calculateVolatility(portfolioId);

    // Calculate risk score (1-10)
    const riskScore = calculateRiskScore(volatility, drawdown.maxDrawdownPercent);

    // Get asset allocation
    const assetAllocation = getAssetAllocation(updatedHoldings);

    // Get sector allocation
    const sectorAllocation = getSectorAllocation(updatedHoldings);

    // Get top holdings
    const topHoldings = updatedHoldings
        .sort((a, b) => b.currentValue - a.currentValue)
        .slice(0, 5)
        .map(h => ({
            symbol: h.symbol,
            name: h.name,
            value: h.currentValue,
            percentage: ((h.currentValue / currentValue) * 100).toFixed(2)
        }));

    return {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        currentValue: parseFloat(currentValue.toFixed(2)),
        unrealizedPL: parseFloat(unrealizedPL.toFixed(2)),
        unrealizedPLPercent: parseFloat(unrealizedPLPercent),
        realizedPL: parseFloat(realizedPL.toFixed(2)),
        dayPL: parseFloat(dayPL.toFixed(2)),
        dayPLPercent: parseFloat(dayPLPercent),
        cagr: parseFloat(cagr.toFixed(2)),
        xirr: parseFloat(xirr.toFixed(2)),
        drawdown: {
            maxDrawdown: parseFloat(drawdown.maxDrawdown.toFixed(2)),
            maxDrawdownPercent: parseFloat(drawdown.maxDrawdownPercent.toFixed(2)),
            currentDrawdown: parseFloat(drawdown.currentDrawdown.toFixed(2))
        },
        volatility: parseFloat(volatility.toFixed(2)),
        riskScore,
        assetAllocation,
        sectorAllocation,
        topHoldings,
        totalHoldings: updatedHoldings.length
    };
};

/**
 * Calculate realized P&L from trades
 */
const calculateRealizedPL = async (portfolioId) => {
    const trades = await Trade.find({ portfolioId });

    let realizedPL = 0;
    const positions = {};

    // Process trades chronologically
    trades.sort((a, b) => new Date(a.tradeDate) - new Date(b.tradeDate));

    for (const trade of trades) {
        if (!positions[trade.symbol]) {
            positions[trade.symbol] = { quantity: 0, totalCost: 0 };
        }

        if (trade.type === 'BUY') {
            positions[trade.symbol].quantity += trade.quantity;
            positions[trade.symbol].totalCost += trade.quantity * trade.price + trade.charges;
        } else if (trade.type === 'SELL') {
            const avgCost = positions[trade.symbol].totalCost / positions[trade.symbol].quantity;
            const sellValue = trade.quantity * trade.price - trade.charges;
            const costBasis = trade.quantity * avgCost;
            realizedPL += sellValue - costBasis;

            positions[trade.symbol].quantity -= trade.quantity;
            positions[trade.symbol].totalCost -= costBasis;
        }
    }

    return realizedPL;
};

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 */
const calculateCAGR = (holdings, totalInvested, currentValue) => {
    if (totalInvested === 0 || holdings.length === 0) return 0;

    // Find oldest holding date
    const oldestDate = holdings.reduce((oldest, h) => {
        return h.purchaseDate < oldest ? h.purchaseDate : oldest;
    }, holdings[0].purchaseDate);

    const years = (Date.now() - new Date(oldestDate)) / (365.25 * 24 * 60 * 60 * 1000);

    if (years < 0.1) return 0; // Less than ~36 days

    const cagr = (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100;
    return cagr;
};

/**
 * Calculate XIRR (Extended Internal Rate of Return)
 * Simplified version using approximation
 */
const calculateXIRR = (holdings, totalInvested, currentValue) => {
    if (totalInvested === 0) return 0;

    // Simplified XIRR calculation
    // For accurate XIRR, we'd need to implement Newton-Raphson method
    const totalReturn = ((currentValue - totalInvested) / totalInvested) * 100;

    // Annualize based on average holding period
    const avgHoldingDays = holdings.reduce((sum, h) => {
        return sum + (Date.now() - new Date(h.purchaseDate)) / (24 * 60 * 60 * 1000);
    }, 0) / holdings.length;

    const years = avgHoldingDays / 365.25;

    if (years < 0.1) return totalReturn;

    const xirr = (Math.pow(1 + totalReturn / 100, 1 / years) - 1) * 100;
    return xirr;
};

/**
 * Calculate maximum drawdown
 */
const calculateDrawdown = async (portfolioId) => {
    // For demo, using simplified calculation
    // In production, this would use historical portfolio values

    const holdings = await Holding.find({ portfolioId });
    const currentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);

    // Simulate peak value (10% higher than current for demo)
    const peakValue = currentValue * 1.1;
    const maxDrawdown = peakValue - currentValue;
    const maxDrawdownPercent = ((maxDrawdown / peakValue) * 100);

    // Current drawdown (random for demo)
    const currentDrawdown = currentValue * (Math.random() * 0.05);

    return {
        maxDrawdown,
        maxDrawdownPercent,
        currentDrawdown
    };
};

/**
 * Calculate portfolio volatility (annualized standard deviation)
 */
const calculateVolatility = async (portfolioId) => {
    // Simplified volatility calculation
    // In production, this would use historical daily returns

    const holdings = await Holding.find({ portfolioId });

    if (holdings.length === 0) return 0;

    // Calculate weighted average volatility based on asset types
    const volatilityByAsset = {
        'Equity': 25,
        'Mutual Fund': 15,
        'Crypto': 60,
        'US Stock': 30
    };

    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);

    const weightedVolatility = holdings.reduce((sum, h) => {
        const weight = h.currentValue / totalValue;
        const assetVol = volatilityByAsset[h.assetType] || 20;
        return sum + (weight * assetVol);
    }, 0);

    return weightedVolatility;
};

/**
 * Calculate risk score (1-10 scale)
 */
const calculateRiskScore = (volatility, maxDrawdownPercent) => {
    // Combine volatility and drawdown to create risk score
    const volScore = Math.min(volatility / 10, 5); // Max 5 points from volatility
    const ddScore = Math.min(maxDrawdownPercent / 10, 5); // Max 5 points from drawdown

    const riskScore = Math.round(volScore + ddScore);
    return Math.max(1, Math.min(10, riskScore)); // Clamp between 1-10
};

/**
 * Get asset allocation breakdown
 */
const getAssetAllocation = (holdings) => {
    const allocation = {};
    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);

    holdings.forEach(h => {
        if (!allocation[h.assetType]) {
            allocation[h.assetType] = 0;
        }
        allocation[h.assetType] += h.currentValue;
    });

    // Convert to percentages
    const result = Object.entries(allocation).map(([type, value]) => ({
        type,
        value: parseFloat(value.toFixed(2)),
        percentage: parseFloat(((value / totalValue) * 100).toFixed(2))
    }));

    return result.sort((a, b) => b.value - a.value);
};

/**
 * Get sector allocation breakdown
 */
const getSectorAllocation = (holdings) => {
    const allocation = {};
    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);

    // Only consider equity holdings for sector allocation
    const equityHoldings = holdings.filter(h => h.assetType === 'Equity' || h.assetType === 'US Stock');

    equityHoldings.forEach(h => {
        const sector = h.sector || 'Other';
        if (!allocation[sector]) {
            allocation[sector] = 0;
        }
        allocation[sector] += h.currentValue;
    });

    // Convert to percentages
    const result = Object.entries(allocation).map(([sector, value]) => ({
        sector,
        value: parseFloat(value.toFixed(2)),
        percentage: parseFloat(((value / totalValue) * 100).toFixed(2))
    }));

    return result.sort((a, b) => b.value - a.value);
};

/**
 * Compare portfolio performance to benchmark
 */
const compareToBenchmark = async (portfolioId, benchmarkName = 'NIFTY50', days = 30) => {
    const holdings = await Holding.find({ portfolioId });

    if (holdings.length === 0) {
        return { portfolioReturn: 0, benchmarkReturn: 0, alpha: 0 };
    }

    // Get benchmark data
    const benchmarkData = marketDataService.getBenchmarkData(benchmarkName, days);

    const benchmarkStart = benchmarkData[0].value;
    const benchmarkEnd = benchmarkData[benchmarkData.length - 1].value;
    const benchmarkReturn = ((benchmarkEnd - benchmarkStart) / benchmarkStart) * 100;

    // Calculate portfolio return (simplified)
    const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
    const currentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const portfolioReturn = ((currentValue - totalInvested) / totalInvested) * 100;

    // Calculate alpha (excess return over benchmark)
    const alpha = portfolioReturn - benchmarkReturn;

    return {
        portfolioReturn: parseFloat(portfolioReturn.toFixed(2)),
        benchmarkReturn: parseFloat(benchmarkReturn.toFixed(2)),
        alpha: parseFloat(alpha.toFixed(2)),
        benchmarkName,
        period: `${days} days`
    };
};

/**
 * Get empty metrics object
 */
const getEmptyMetrics = () => ({
    totalInvested: 0,
    currentValue: 0,
    unrealizedPL: 0,
    unrealizedPLPercent: 0,
    realizedPL: 0,
    dayPL: 0,
    dayPLPercent: 0,
    cagr: 0,
    xirr: 0,
    drawdown: {
        maxDrawdown: 0,
        maxDrawdownPercent: 0,
        currentDrawdown: 0
    },
    volatility: 0,
    riskScore: 1,
    assetAllocation: [],
    sectorAllocation: [],
    topHoldings: [],
    totalHoldings: 0
});

module.exports = {
    calculatePortfolioMetrics,
    compareToBenchmark,
    calculateCAGR,
    calculateXIRR,
    calculateDrawdown,
    calculateVolatility,
    calculateRiskScore
};
