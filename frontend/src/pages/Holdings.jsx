import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { holdingService } from '../services';

export default function Holdings() {
    const { id } = useParams();
    const [holdings, setHoldings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHoldings();
    }, [id]);

    const loadHoldings = async () => {
        try {
            const data = await holdingService.getAll(id);
            setHoldings(data.holdings);
        } catch (err) {
            console.error('Failed to load holdings:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center"><div className="spinner"></div></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Holdings</h1>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P&L</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {holdings.map(holding => (
                            <tr key={holding._id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{holding.symbol}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{holding.assetType}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{holding.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">₹{holding.avgPrice}</td>
                                <td className="px-6 py-4 whitespace-nowrap">₹{holding.currentPrice}</td>
                                <td className={`px-6 py-4 whitespace-nowrap ${holding.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ₹{holding.unrealizedPL?.toFixed(2)} ({holding.unrealizedPLPercent}%)
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
