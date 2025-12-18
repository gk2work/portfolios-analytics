const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    symbol: {
        type: String,
        required: [true, 'Symbol is required'],
        uppercase: true,
        trim: true
    },
    alertType: {
        type: String,
        required: [true, 'Alert type is required'],
        enum: ['PRICE_BREAKOUT', 'VOLUME_SPIKE', 'RSI', 'PERCENT_MOVE']
    },
    // Conditions based on alert type
    conditions: {
        // For PRICE_BREAKOUT
        targetPrice: {
            type: Number,
            min: 0
        },
        direction: {
            type: String,
            enum: ['ABOVE', 'BELOW']
        },
        // For VOLUME_SPIKE
        volumeThreshold: {
            type: Number,
            min: 0
        },
        // For RSI
        rsiLevel: {
            type: Number,
            min: 0,
            max: 100
        },
        rsiCondition: {
            type: String,
            enum: ['OVERBOUGHT', 'OVERSOLD']
        },
        // For PERCENT_MOVE
        percentChange: {
            type: Number
        },
        timeframe: {
            type: String,
            enum: ['1D', '1W', '1M'],
            default: '1D'
        }
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'TRIGGERED', 'DISABLED'],
        default: 'ACTIVE'
    },
    notificationPreferences: {
        email: {
            type: Boolean,
            default: true
        },
        inApp: {
            type: Boolean,
            default: true
        }
    },
    lastTriggered: {
        type: Date
    },
    triggerCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
alertSchema.index({ userId: 1, status: 1 });
alertSchema.index({ symbol: 1, status: 1 });

module.exports = mongoose.model('Alert', alertSchema);
