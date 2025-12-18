const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
    portfolioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Portfolio',
        required: true,
        index: true
    },
    symbol: {
        type: String,
        required: [true, 'Symbol is required'],
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        trim: true,
        default: ''
    },
    assetType: {
        type: String,
        required: [true, 'Asset type is required'],
        enum: ['Equity', 'Mutual Fund', 'Crypto', 'US Stock'],
        default: 'Equity'
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative']
    },
    avgPrice: {
        type: Number,
        required: [true, 'Average price is required'],
        min: [0, 'Price cannot be negative']
    },
    currentPrice: {
        type: Number,
        default: 0,
        min: [0, 'Price cannot be negative']
    },
    sector: {
        type: String,
        trim: true,
        default: 'Other'
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual fields for calculated values
holdingSchema.virtual('investedValue').get(function () {
    return this.quantity * this.avgPrice;
});

holdingSchema.virtual('currentValue').get(function () {
    return this.quantity * this.currentPrice;
});

holdingSchema.virtual('unrealizedPL').get(function () {
    return this.currentValue - this.investedValue;
});

holdingSchema.virtual('unrealizedPLPercent').get(function () {
    if (this.investedValue === 0) return 0;
    return ((this.unrealizedPL / this.investedValue) * 100).toFixed(2);
});

// Index for faster queries
holdingSchema.index({ portfolioId: 1, symbol: 1 });

module.exports = mongoose.model('Holding', holdingSchema);
