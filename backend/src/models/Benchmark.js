const mongoose = require('mongoose');

const benchmarkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Benchmark name is required'],
        enum: ['NIFTY50', 'SENSEX', 'SP500'],
        index: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        index: true
    },
    value: {
        type: Number,
        required: [true, 'Value is required'],
        min: [0, 'Value cannot be negative']
    },
    change: {
        type: Number,
        default: 0
    },
    changePercent: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
benchmarkSchema.index({ name: 1, date: -1 });

module.exports = mongoose.model('Benchmark', benchmarkSchema);
