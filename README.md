# 📊 Trading Analytics & Insights Platform

> A comprehensive MERN stack application for Indian retail traders to analyze portfolios, track performance, and get smart trading insights.

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🌟 Features

### Core Functionality
- ✅ **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- ✅ **Portfolio Management** - Create and manage multiple portfolios with different asset types
- ✅ **Advanced Analytics** - Comprehensive metrics including P&L, CAGR, XIRR, drawdown, and volatility
- ✅ **Smart Alerts** - Rule-based alerts for price breakouts, volume spikes, RSI, and percentage moves
- ✅ **Tax Estimation** - Indian tax calculations (STCG/LTCG) with FY-wise reports
- ✅ **Asset Support** - Equity, Mutual Funds, Crypto, and US Stocks
- ✅ **Benchmark Comparison** - Compare performance against NIFTY50, SENSEX, and S&P500

### Analytics Metrics
- Total Invested & Current Value
- Unrealized & Realized P&L
- Day P&L with percentage change
- CAGR (Compound Annual Growth Rate)
- XIRR (Extended Internal Rate of Return)
- Maximum Drawdown Analysis
- Portfolio Volatility
- Risk Score (1-10 scale)
- Asset & Sector Allocation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (connection string provided)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/gk2work/portfolios-analytics.git
cd portfolios-analytics
```

2. **Setup Backend**
```bash
cd backend
npm install
npm run seed  # Seed demo data
npm run dev   # Start backend server
```

3. **Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
npm run dev   # Start frontend server
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Demo Credentials
```
Email: demo@tradinganalytics.com
Password: demo123
```

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Auth, validation, error handling
│   │   └── utils/            # Utilities (seed data)
│   └── server.js             # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── context/          # React context
│   │   └── App.jsx           # Main app component
│   └── vite.config.js
│
├── README.md
├── QUICK_START.md
└── .gitignore
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM
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

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Portfolios
- `GET /api/portfolios` - Get all portfolios
- `POST /api/portfolios` - Create portfolio
- `GET /api/portfolios/:id` - Get single portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio

### Holdings
- `GET /api/holdings/portfolios/:portfolioId/holdings` - Get holdings
- `POST /api/holdings/portfolios/:portfolioId/holdings` - Add holding
- `POST /api/holdings/portfolios/:portfolioId/holdings/import` - Import CSV
- `PUT /api/holdings/:id` - Update holding
- `DELETE /api/holdings/:id` - Delete holding

### Analytics
- `GET /api/analytics/portfolios/:portfolioId/analytics` - Get portfolio analytics
- `GET /api/analytics/portfolios/:portfolioId/analytics/benchmark` - Benchmark comparison

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

### Tax
- `GET /api/tax/portfolios/:portfolioId/tax-report` - Get tax report
- `GET /api/tax/portfolios/:portfolioId/tax-report/fy-wise` - FY-wise report

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] User authentication
- [x] Portfolio & holdings management
- [x] Analytics engine
- [x] Smart alerts system
- [x] Tax estimation
- [x] Mock market data

### Phase 2 (Next)
- [ ] Real-time market data integration
- [ ] Advanced charting with Recharts
- [ ] Complete alert management UI
- [ ] Enhanced tax reports with PDF export
- [ ] CSV import UI

### Phase 3 (Future)
- [ ] Broker API integrations (Zerodha, Groww, Upstox)
- [ ] AI-based trading insights
- [ ] Mobile app (React Native)
- [ ] Subscription tiers
- [ ] Real-time WebSocket updates

## 🔐 Security

- JWT tokens with 7-day expiration
- Bcrypt password hashing (10 rounds)
- CORS enabled
- Input validation with Joi
- Protected API routes
- Environment variables for secrets

## 📝 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ for Indian retail traders**
