require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Holding = require('../models/Holding');
const Benchmark = require('../models/Benchmark');

/**
 * Seed database with demo data
 */
const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data (optional - comment out if you want to keep existing data)
        // await User.deleteMany({});
        // await Portfolio.deleteMany({});
        // await Holding.deleteMany({});
        // await Benchmark.deleteMany({});
        // console.log('🗑️  Cleared existing data');

        // Create demo user
        const demoUser = new User({
            name: 'Demo User',
            email: 'demo@tradinganalytics.com',
            password: 'demo123',
            riskPreference: 'moderate'
        });
        await demoUser.save();
        console.log('👤 Created demo user');

        // Create demo portfolio
        const demoPortfolio = new Portfolio({
            userId: demoUser._id,
            name: 'My Investment Portfolio',
            description: 'Long-term investment portfolio with diversified holdings'
        });
        await demoPortfolio.save();
        console.log('📁 Created demo portfolio');

        // Create demo holdings
        const demoHoldings = [
            {
                portfolioId: demoPortfolio._id,
                symbol: 'RELIANCE',
                name: 'Reliance Industries Ltd',
                assetType: 'Equity',
                quantity: 50,
                avgPrice: 2300,
                currentPrice: 2456.75,
                sector: 'Energy',
                purchaseDate: new Date('2023-01-15')
            },
            {
                portfolioId: demoPortfolio._id,
                symbol: 'TCS',
                name: 'Tata Consultancy Services',
                assetType: 'Equity',
                quantity: 30,
                avgPrice: 3500,
                currentPrice: 3678.90,
                sector: 'IT',
                purchaseDate: new Date('2023-03-20')
            },
            {
                portfolioId: demoPortfolio._id,
                symbol: 'HDFCBANK',
                name: 'HDFC Bank Ltd',
                assetType: 'Equity',
                quantity: 100,
                avgPrice: 1600,
                currentPrice: 1678.45,
                sector: 'Banking',
                purchaseDate: new Date('2023-02-10')
            },
            {
                portfolioId: demoPortfolio._id,
                symbol: 'INFY',
                name: 'Infosys Ltd',
                assetType: 'Equity',
                quantity: 75,
                avgPrice: 1400,
                currentPrice: 1456.30,
                sector: 'IT',
                purchaseDate: new Date('2023-04-05')
            },
            {
                portfolioId: demoPortfolio._id,
                symbol: 'AAPL',
                name: 'Apple Inc',
                assetType: 'US Stock',
                quantity: 10,
                avgPrice: 170,
                currentPrice: 178.50,
                sector: 'Technology',
                purchaseDate: new Date('2023-05-12')
            },
            {
                portfolioId: demoPortfolio._id,
                symbol: 'BTC',
                name: 'Bitcoin',
                assetType: 'Crypto',
                quantity: 0.5,
                avgPrice: 40000,
                currentPrice: 43250,
                sector: 'Cryptocurrency',
                purchaseDate: new Date('2023-06-01')
            }
        ];

        await Holding.insertMany(demoHoldings);
        console.log('💼 Created demo holdings');

        // Create benchmark data for last 30 days
        const benchmarks = ['NIFTY50', 'SENSEX', 'SP500'];
        const baseValues = {
            'NIFTY50': 21500,
            'SENSEX': 71000,
            'SP500': 4750
        };

        for (const benchmark of benchmarks) {
            const data = [];
            const today = new Date();

            for (let i = 29; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);

                const trend = Math.sin(i / 15) * 0.03;
                const noise = (Math.random() - 0.5) * 0.01;
                const value = baseValues[benchmark] * (1 + trend + noise);
                const change = value * (noise * 2);

                data.push({
                    name: benchmark,
                    date,
                    value: parseFloat(value.toFixed(2)),
                    change: parseFloat(change.toFixed(2)),
                    changePercent: parseFloat((noise * 200).toFixed(2))
                });
            }

            await Benchmark.insertMany(data);
        }
        console.log('📊 Created benchmark data');

        console.log('\n✅ Seed data created successfully!');
        console.log('\n📝 Demo credentials:');
        console.log('   Email: demo@tradinganalytics.com');
        console.log('   Password: demo123');
        console.log('\n🚀 You can now start the server and login with these credentials.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

// Run seed
seedData();
