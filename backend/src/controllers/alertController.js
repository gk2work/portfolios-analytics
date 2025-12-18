const Alert = require('../models/Alert');
const alertService = require('../services/alertService');

/**
 * Create new alert
 * POST /api/alerts
 */
const createAlert = async (req, res, next) => {
    try {
        const alert = await alertService.createAlert(req.userId, req.body);

        res.status(201).json({
            message: 'Alert created successfully',
            alert
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all alerts for user
 * GET /api/alerts
 */
const getAlerts = async (req, res, next) => {
    try {
        const { status, symbol } = req.query;

        const query = { userId: req.userId };
        if (status) query.status = status.toUpperCase();
        if (symbol) query.symbol = symbol.toUpperCase();

        const alerts = await Alert.find(query).sort({ createdAt: -1 });

        res.json({
            count: alerts.length,
            alerts
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single alert
 * GET /api/alerts/:id
 */
const getAlertById = async (req, res, next) => {
    try {
        const alert = await Alert.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        res.json({ alert });
    } catch (error) {
        next(error);
    }
};

/**
 * Update alert
 * PUT /api/alerts/:id
 */
const updateAlert = async (req, res, next) => {
    try {
        const alert = await Alert.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        // Update allowed fields
        if (req.body.conditions) {
            alert.conditions = { ...alert.conditions, ...req.body.conditions };
        }
        if (req.body.status) {
            alert.status = req.body.status;
        }
        if (req.body.notificationPreferences) {
            alert.notificationPreferences = {
                ...alert.notificationPreferences,
                ...req.body.notificationPreferences
            };
        }

        await alert.save();

        res.json({
            message: 'Alert updated successfully',
            alert
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete alert
 * DELETE /api/alerts/:id
 */
const deleteAlert = async (req, res, next) => {
    try {
        const alert = await Alert.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        await alert.deleteOne();

        res.json({
            message: 'Alert deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Manually trigger alert evaluation (for testing)
 * POST /api/alerts/evaluate
 */
const evaluateAlerts = async (req, res, next) => {
    try {
        await alertService.evaluateAlerts();

        res.json({
            message: 'Alert evaluation completed'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAlert,
    getAlerts,
    getAlertById,
    updateAlert,
    deleteAlert,
    evaluateAlerts
};
