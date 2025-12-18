/**
 * Mock Market Data Service
 * Provides simulated market data for development and testing
 * In production, this would be replaced with real API integrations
 */

// Mock price data for common Indian stocks
const mockPrices = {
    // Indian Equities
    'RELIANCE': 2456.75,
    'TCS': 3678.90,
    'INFY': 1456.30,
    'HDFCBANK': 1678.45,
    'ICICIBANK': 987.60,
    'SBIN': 567.80,
    'BHARTIARTL': 876.50,
    'ITC': 456.20,
    'HINDUNILVR': 2567.80,
    'LT': 3234.50,
    'WIPRO': 456.70,
    'AXISBANK': 987.30,
    'MARUTI': 9876.50,
    'TATAMOTORS': 567.40,
    'BAJFINANCE': 6789.20,

    // US Stocks
    'AAPL': 178.50,
    'GOOGL': 142.30,
    'MSFT': 378.90,
    'AMZN': 152.60,
    'TSLA': 242.80,
    'NVDA': 495.20,

    // Crypto
    'BTC': 43250.00,
    'ETH': 2280.50,
    'BNB': 312.40
};

// Mock volume data
const mockVolumes = {
    'RELIANCE': 12500000,
    'TCS': 8900000,
    'INFY': 15600000,
    'HDFCBANK': 11200000,
    'AAPL': 45000000,
    'BTC': 28000000
};

/**
 * Get current price for a symbol
 * @param {string} symbol - Stock/crypto symbol
 * @returns {number} Current price
 */
const getCurrentPrice = (symbol) => {
    const basePrice = mockPrices[symbol.toUpperCase()] || 100;
    // Add random fluctuation (-2% to +2%)
    const fluctuation = (Math.random() - 0.5) * 0.04;
    return parseFloat((basePrice * (1 + fluctuation)).toFixed(2));
};

/**
 * Get historical prices for a symbol
 * @param {string} symbol - Stock/crypto symbol
 * @param {number} days - Number of days of history
 * @returns {Array} Array of {date, price} objects
 */
const getHistoricalPrices = (symbol, days = 30) => {
    const basePrice = mockPrices[symbol.toUpperCase()] || 100;
    const prices = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Generate realistic price movement
        const trend = Math.sin(i / 10) * 0.05; // Sinusoidal trend
        const noise = (Math.random() - 0.5) * 0.03; // Random noise
        const price = basePrice * (1 + trend + noise);

        prices.push({
            date: date.toISOString().split('T')[0],
            price: parseFloat(price.toFixed(2)),
            volume: Math.floor((mockVolumes[symbol.toUpperCase()] || 1000000) * (0.8 + Math.random() * 0.4))
        });
    }

    return prices;
};

/**
 * Get benchmark index data
 * @param {string} benchmarkName - NIFTY50, SENSEX, or SP500
 * @param {number} days - Number of days of history
 * @returns {Array} Array of {date, value} objects
 */
const getBenchmarkData = (benchmarkName, days = 30) => {
    const baseValues = {
        'NIFTY50': 21500,
        'SENSEX': 71000,
        'SP500': 4750
    };

    const baseValue = baseValues[benchmarkName] || 10000;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const trend = Math.sin(i / 15) * 0.03;
        const noise = (Math.random() - 0.5) * 0.01;
        const value = baseValue * (1 + trend + noise);

        data.push({
            date: date.toISOString().split('T')[0],
            value: parseFloat(value.toFixed(2)),
            change: parseFloat((value * (noise * 2)).toFixed(2)),
            changePercent: parseFloat((noise * 200).toFixed(2))
        });
    }

    return data;
};

/**
 * Calculate RSI (Relative Strength Index)
 * @param {Array} prices - Array of price objects
 * @param {number} period - RSI period (default 14)
 * @returns {number} RSI value (0-100)
 */
const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) {
        return 50; // Default neutral RSI
    }

    let gains = 0;
    let losses = 0;

    // Calculate initial average gain and loss
    for (let i = 1; i <= period; i++) {
        const change = prices[i].price - prices[i - 1].price;
        if (change > 0) {
            gains += change;
        } else {
            losses += Math.abs(change);
        }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate subsequent values
    for (let i = period + 1; i < prices.length; i++) {
        const change = prices[i].price - prices[i - 1].price;
        if (change > 0) {
            avgGain = (avgGain * (period - 1) + change) / period;
            avgLoss = (avgLoss * (period - 1)) / period;
        } else {
            avgGain = (avgGain * (period - 1)) / period;
            avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
        }
    }

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return parseFloat(rsi.toFixed(2));
};

/**
 * Get current volume for a symbol
 * @param {string} symbol - Stock/crypto symbol
 * @returns {number} Current volume
 */
const getCurrentVolume = (symbol) => {
    const baseVolume = mockVolumes[symbol.toUpperCase()] || 1000000;
    // Add random fluctuation
    const fluctuation = (Math.random() - 0.5) * 0.6;
    return Math.floor(baseVolume * (1 + fluctuation));
};

/**
 * Get average volume for a symbol
 * @param {string} symbol - Stock/crypto symbol
 * @param {number} days - Number of days for average
 * @returns {number} Average volume
 */
const getAverageVolume = (symbol, days = 30) => {
    return mockVolumes[symbol.toUpperCase()] || 1000000;
};

/**
 * Update prices for holdings (batch update)
 * @param {Array} holdings - Array of holding objects
 * @returns {Array} Holdings with updated current prices
 */
const updateHoldingPrices = (holdings) => {
    return holdings.map(holding => ({
        ...holding,
        currentPrice: getCurrentPrice(holding.symbol)
    }));
};

module.exports = {
    getCurrentPrice,
    getHistoricalPrices,
    getBenchmarkData,
    calculateRSI,
    getCurrentVolume,
    getAverageVolume,
    updateHoldingPrices
};
