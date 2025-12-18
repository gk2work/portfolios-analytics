const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
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
    type: {
        type: String,
        required: [true, 'Trade type is required'],
        enum: ['BUY', 'SELL'],
        uppercase: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0.001, 'Quantity must be positive']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    tradeDate: {
        type: Date,
        required: [true, 'Trade date is required'],
        default: Date.now
    },
    charges: {
        type: Number,
        default: 0,
        min: [0, 'Charges cannot be negative']
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for total value
tradeSchema.virtual('totalValue').get(function () {
    return this.quantity * this.price + this.charges;
});

// Index for faster queries
tradeSchema.index({ portfolioId: 1, tradeDate: -1 });
tradeSchema.index({ symbol: 1, tradeDate: -1 });

module.exports = mongoose.model('Trade', tradeSchema);
