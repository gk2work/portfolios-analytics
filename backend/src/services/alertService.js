const Alert = require('../models/Alert');
const marketDataService = require('./marketDataService');
const emailService = require('./emailService');

/**
 * Evaluate all active alerts
 * This should be called periodically (e.g., every 5 minutes via cron job)
 */
const evaluateAlerts = async () => {
    try {
        const activeAlerts = await Alert.find({ status: 'ACTIVE' }).populate('userId');

        console.log(`Evaluating ${activeAlerts.length} active alerts...`);

        for (const alert of activeAlerts) {
            const triggered = await evaluateAlert(alert);

            if (triggered) {
                // Update alert status
                alert.status = 'TRIGGERED';
                alert.lastTriggered = new Date();
                alert.triggerCount += 1;
                await alert.save();

                // Send notifications
                await sendNotification(alert);
            }
        }
    } catch (error) {
        console.error('Error evaluating alerts:', error);
    }
};

/**
 * Evaluate a single alert
 */
const evaluateAlert = async (alert) => {
    try {
        switch (alert.alertType) {
            case 'PRICE_BREAKOUT':
                return await checkPriceBreakout(alert);

            case 'VOLUME_SPIKE':
                return await checkVolumeSpike(alert);

            case 'RSI':
                return await checkRSI(alert);

            case 'PERCENT_MOVE':
                return await checkPercentMove(alert);

            default:
                return false;
        }
    } catch (error) {
        console.error(`Error evaluating alert ${alert._id}:`, error);
        return false;
    }
};

/**
 * Check price breakout alert
 */
const checkPriceBreakout = async (alert) => {
    const currentPrice = marketDataService.getCurrentPrice(alert.symbol);
    const { targetPrice, direction } = alert.conditions;

    if (direction === 'ABOVE' && currentPrice >= targetPrice) {
        return true;
    }

    if (direction === 'BELOW' && currentPrice <= targetPrice) {
        return true;
    }

    return false;
};

/**
 * Check volume spike alert
 */
const checkVolumeSpike = async (alert) => {
    const currentVolume = marketDataService.getCurrentVolume(alert.symbol);
    const avgVolume = marketDataService.getAverageVolume(alert.symbol);
    const { volumeThreshold } = alert.conditions;

    const volumeRatio = currentVolume / avgVolume;

    return volumeRatio >= volumeThreshold;
};

/**
 * Check RSI alert
 */
const checkRSI = async (alert) => {
    const historicalPrices = marketDataService.getHistoricalPrices(alert.symbol, 30);
    const rsi = marketDataService.calculateRSI(historicalPrices);
    const { rsiLevel, rsiCondition } = alert.conditions;

    if (rsiCondition === 'OVERBOUGHT' && rsi >= rsiLevel) {
        return true;
    }

    if (rsiCondition === 'OVERSOLD' && rsi <= rsiLevel) {
        return true;
    }

    return false;
};

/**
 * Check percent move alert
 */
const checkPercentMove = async (alert) => {
    const { percentChange, timeframe } = alert.conditions;

    let days = 1;
    if (timeframe === '1W') days = 7;
    if (timeframe === '1M') days = 30;

    const historicalPrices = marketDataService.getHistoricalPrices(alert.symbol, days + 1);

    if (historicalPrices.length < 2) return false;

    const oldPrice = historicalPrices[0].price;
    const currentPrice = historicalPrices[historicalPrices.length - 1].price;
    const actualChange = ((currentPrice - oldPrice) / oldPrice) * 100;

    // Check if absolute change exceeds threshold
    return Math.abs(actualChange) >= Math.abs(percentChange);
};

/**
 * Send notification for triggered alert
 */
const sendNotification = async (alert) => {
    try {
        const currentPrice = marketDataService.getCurrentPrice(alert.symbol);

        // Prepare notification message
        const message = formatAlertMessage(alert, currentPrice);

        // Send email if enabled
        if (alert.notificationPreferences.email && alert.userId.email) {
            await emailService.sendAlertEmail(
                alert.userId.email,
                alert.symbol,
                message
            );
        }

        // In-app notification would be handled by frontend
        // For now, just log it
        if (alert.notificationPreferences.inApp) {
            console.log(`In-app notification: ${message}`);
        }

        console.log(`Alert triggered for ${alert.userId.email}: ${message}`);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

/**
 * Format alert message
 */
const formatAlertMessage = (alert, currentPrice) => {
    switch (alert.alertType) {
        case 'PRICE_BREAKOUT':
            return `${alert.symbol} has ${alert.conditions.direction === 'ABOVE' ? 'crossed above' : 'fallen below'} ₹${alert.conditions.targetPrice}. Current price: ₹${currentPrice}`;

        case 'VOLUME_SPIKE':
            return `${alert.symbol} is experiencing high volume (${alert.conditions.volumeThreshold}x average). Current price: ₹${currentPrice}`;

        case 'RSI':
            return `${alert.symbol} RSI is ${alert.conditions.rsiCondition} (${alert.conditions.rsiLevel}). Current price: ₹${currentPrice}`;

        case 'PERCENT_MOVE':
            return `${alert.symbol} has moved ${alert.conditions.percentChange}% in ${alert.conditions.timeframe}. Current price: ₹${currentPrice}`;

        default:
            return `Alert triggered for ${alert.symbol}. Current price: ₹${currentPrice}`;
    }
};

/**
 * Create a new alert with validation
 */
const createAlert = async (userId, alertData) => {
    // Validate conditions based on alert type
    validateAlertConditions(alertData.alertType, alertData.conditions);

    const alert = new Alert({
        userId,
        ...alertData
    });

    await alert.save();
    return alert;
};

/**
 * Validate alert conditions
 */
const validateAlertConditions = (alertType, conditions) => {
    switch (alertType) {
        case 'PRICE_BREAKOUT':
            if (!conditions.targetPrice || !conditions.direction) {
                throw new Error('Price breakout alert requires targetPrice and direction');
            }
            break;

        case 'VOLUME_SPIKE':
            if (!conditions.volumeThreshold) {
                throw new Error('Volume spike alert requires volumeThreshold');
            }
            break;

        case 'RSI':
            if (!conditions.rsiLevel || !conditions.rsiCondition) {
                throw new Error('RSI alert requires rsiLevel and rsiCondition');
            }
            break;

        case 'PERCENT_MOVE':
            if (!conditions.percentChange) {
                throw new Error('Percent move alert requires percentChange');
            }
            break;
    }
};

module.exports = {
    evaluateAlerts,
    evaluateAlert,
    checkPriceBreakout,
    checkVolumeSpike,
    checkRSI,
    checkPercentMove,
    sendNotification,
    createAlert
};
