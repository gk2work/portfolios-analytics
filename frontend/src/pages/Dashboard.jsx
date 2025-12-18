import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portfolioService, analyticsService } from '../services';

export default function Dashboard() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPortfolios();
    }, []);

    useEffect(() => {
        if (selectedPortfolio) {
            loadAnalytics(selectedPortfolio._id);
        }
    }, [selectedPortfolio]);

    const loadPortfolios = async () => {
        try {
            const data = await portfolioService.getAll();
            setPortfolios(data.portfolios);
            if (data.portfolios.length > 0) {
                setSelectedPortfolio(data.portfolios[0]);
            }
        } catch (err) {
            setError('Failed to load portfolios');
        } finally {
            setLoading(false);
        }
    };

    const loadAnalytics = async (portfolioId) => {
        try {
            const data = await analyticsService.getPortfolioAnalytics(portfolioId, 'NIFTY50');
            setAnalytics(data.metrics);
        } catch (err) {
            console.error('Failed to load analytics:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }

    if (portfolios.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Trading Analytics!</h2>
                <p className="text-gray-600 mb-6">You don't have any portfolios yet. Create one to get started.</p>
                <Link
                    to="/portfolios"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md inline-block"
                >
                    Create Portfolio
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <Link
                    to="/portfolios"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
                >
                    Manage Portfolios
                </Link>
            </div>

            {/* Portfolio Selector */}
            <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-gray-700 font-medium mb-2">Select Portfolio</label>
                <select
                    value={selectedPortfolio?._id || ''}
                    onChange={(e) => {
                        const portfolio = portfolios.find(p => p._id === e.target.value);
                        setSelectedPortfolio(portfolio);
                    }}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    {portfolios.map(portfolio => (
                        <option key={portfolio._id} value={portfolio._id}>
                            {portfolio.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Analytics Cards */}
            {analytics && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Invested"
                            value={`₹${analytics.totalInvested.toLocaleString()}`}
                            icon="💰"
                        />
                        <MetricCard
                            title="Current Value"
                            value={`₹${analytics.currentValue.toLocaleString()}`}
                            icon="📈"
                        />
                        <MetricCard
                            title="Unrealized P&L"
                            value={`₹${analytics.unrealizedPL.toLocaleString()}`}
                            change={analytics.unrealizedPLPercent}
                            icon="💵"
                        />
                        <MetricCard
                            title="CAGR"
                            value={`${analytics.cagr.toFixed(2)}%`}
                            icon="📊"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="Day P&L"
                            value={`₹${analytics.dayPL.toLocaleString()}`}
                            change={analytics.dayPLPercent}
                            icon="📅"
                        />
                        <MetricCard
                            title="Volatility"
                            value={`${analytics.volatility.toFixed(2)}%`}
                            icon="📉"
                        />
                        <MetricCard
                            title="Risk Score"
                            value={`${analytics.riskScore}/10`}
                            icon="⚠️"
                        />
                    </div>

                    {/* Asset Allocation */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Asset Allocation</h3>
                        <div className="space-y-3">
                            {analytics.assetAllocation.map((asset, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-32 text-gray-700 font-medium">{asset.type}</div>
                                        <div className="flex-1 bg-gray-200 rounded-full h-4 w-64">
                                            <div
                                                className="bg-primary-600 h-4 rounded-full"
                                                style={{ width: `${asset.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-gray-700 font-medium">
                                        {asset.percentage}% (₹{asset.value.toLocaleString()})
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            to={`/portfolios/${selectedPortfolio._id}/holdings`}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
                        >
                            <div className="text-4xl mb-2">💼</div>
                            <h3 className="text-lg font-bold text-gray-800">View Holdings</h3>
                            <p className="text-gray-600 text-sm mt-2">{analytics.totalHoldings} holdings</p>
                        </Link>
                        <Link
                            to={`/portfolios/${selectedPortfolio._id}/analytics`}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
                        >
                            <div className="text-4xl mb-2">📊</div>
                            <h3 className="text-lg font-bold text-gray-800">Detailed Analytics</h3>
                            <p className="text-gray-600 text-sm mt-2">View charts & insights</p>
                        </Link>
                        <Link
                            to={`/portfolios/${selectedPortfolio._id}/tax-report`}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
                        >
                            <div className="text-4xl mb-2">📋</div>
                            <h3 className="text-lg font-bold text-gray-800">Tax Report</h3>
                            <p className="text-gray-600 text-sm mt-2">View tax estimates</p>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

function MetricCard({ title, value, change, icon }) {
    const isPositive = change >= 0;
    const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
                <span className="text-2xl">{icon}</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            {change !== undefined && (
                <div className={`text-sm font-medium mt-1 ${changeColor}`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                </div>
            )}
        </div>
    );
}
