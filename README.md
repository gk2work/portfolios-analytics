# Trading Analytics & Insights Platform (India-focused)

A comprehensive MERN stack application for Indian retail traders to analyze portfolios, track performance, and get smart trading insights.

## 🚀 Features

### Core Features (MVP)
- ✅ **User Authentication** - JWT-based secure authentication
- ✅ **Portfolio Management** - Multiple portfolios per user
- ✅ **Holdings Tracking** - Support for Equity, Mutual Funds, Crypto, US Stocks
- ✅ **Analytics Engine** - P&L, CAGR, XIRR, Drawdown, Volatility, Risk Score
- ✅ **Asset & Sector Allocation** - Visual breakdown of investments
- ✅ **Smart Alerts** - Price, Volume, RSI, Percentage move alerts
- ✅ **Tax Estimation** - Indian STCG/LTCG calculations
- ✅ **Benchmark Comparison** - Compare against NIFTY50, SENSEX, SP500

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API
- **MongoDB** - Database (MongoDB Atlas)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Joi** - Input validation
- **Nodemailer** - Email notifications

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Recharts** - Charts (ready to use)
- **Vite** - Build tool

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (connection string provided)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env` file with:
   - MongoDB connection string
   - JWT secret
   - Email configuration (optional)

4. Seed demo data:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔐 Demo Credentials

```
Email: demo@tradinganalytics.com
Password: demo123
```

The demo account comes pre-loaded with:
- Sample portfolio
- 6 holdings (Indian stocks, US stocks, crypto)
- 30 days of benchmark data

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Portfolios
- `POST /api/portfolios` - Create portfolio
- `GET /api/portfolios` - Get all portfolios
- `GET /api/portfolios/:id` - Get single portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio

### Holdings
- `POST /api/holdings/portfolios/:portfolioId/holdings` - Add holding
- `GET /api/holdings/portfolios/:portfolioId/holdings` - Get holdings
- `PUT /api/holdings/:id` - Update holding
- `DELETE /api/holdings/:id` - Delete holding
- `POST /api/holdings/portfolios/:portfolioId/holdings/import` - Import CSV

### Analytics
- `GET /api/analytics/portfolios/:portfolioId/analytics` - Get portfolio analytics
- `GET /api/analytics/portfolios/:portfolioId/analytics/benchmark` - Benchmark comparison

### Alerts
- `POST /api/alerts` - Create alert
- `GET /api/alerts` - Get all alerts
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert
- `POST /api/alerts/evaluate` - Manually evaluate alerts

### Tax Reports
- `GET /api/tax/portfolios/:portfolioId/tax-report` - Get tax report
- `GET /api/tax/portfolios/:portfolioId/tax-report/fy-wise` - FY-wise report

## 📊 Analytics Metrics

The platform calculates the following metrics:

- **Total Invested** - Sum of all investments
- **Current Value** - Current market value
- **Unrealized P&L** - Profit/Loss on current holdings
- **Realized P&L** - Profit/Loss from sold positions
- **Day P&L** - Today's profit/loss
- **CAGR** - Compound Annual Growth Rate
- **XIRR** - Extended Internal Rate of Return
- **Drawdown** - Maximum portfolio decline
- **Volatility** - Portfolio volatility (annualized)
- **Risk Score** - 1-10 scale based on volatility and drawdown
- **Asset Allocation** - Breakdown by asset type
- **Sector Allocation** - Breakdown by sector (for equities)

## 🔔 Alert Types

1. **Price Breakout** - Trigger when price crosses a threshold
2. **Volume Spike** - Trigger on unusual volume
3. **RSI** - Trigger on overbought/oversold conditions
4. **Percent Move** - Trigger on percentage change

## 💰 Tax Calculations

Indian tax rules implemented:

- **Equity STCG** - 15% (holding period ≤ 1 year)
- **Equity LTCG** - 10% above ₹1 lakh (holding period > 1 year)
- **Non-Equity STCG** - 30% (holding period ≤ 3 years)
- **Non-Equity LTCG** - 20% with indexation (holding period > 3 years)

**Note:** Tax calculations are approximate. Consult a tax professional for actual filing.

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Auth, validation, error handling
│   ├── utils/            # Utilities (seed data)
│   └── app.js            # Express app configuration
├── server.js             # Entry point
└── .env                  # Environment variables

frontend/
├── src/
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   ├── context/          # React context (Auth)
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── index.html
└── vite.config.js
```

## 🔮 Future Enhancements

- Real-time market data integration (Alpha Vantage, Yahoo Finance)
- Broker API integrations (Zerodha, Groww, Upstox)
- Advanced charting with TradingView
- AI-based trading insights
- Subscription tiers (₹299-₹999)
- Mobile app (React Native)
- B2B analytics APIs
- White-label solutions

## 🐛 Known Limitations

- Market data is currently **mocked** for demo purposes
- Email notifications require SMTP configuration
- Tax calculations are approximate
- No real-time data updates (requires WebSocket integration)

## 📝 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

This is a demo project. For production use, consider:
- Implementing real market data APIs
- Adding comprehensive test coverage
- Implementing rate limiting
- Adding data encryption
- Setting up CI/CD pipelines
- Implementing caching (Redis)
- Adding monitoring and logging

## 📧 Support

For questions or issues, please refer to the documentation or create an issue in the repository.

---

**Built with ❤️ for Indian retail traders**
