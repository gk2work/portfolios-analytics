import { useParams } from 'react-router-dom';

export default function Analytics() {
    const { id } = useParams();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Detailed Analytics</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600">
                    Advanced analytics with charts coming soon. Portfolio ID: {id}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                    This page will include:
                    <ul className="list-disc ml-6 mt-2">
                        <li>Performance charts</li>
                        <li>Drawdown visualization</li>
                        <li>Sector allocation pie chart</li>
                        <li>Benchmark comparison</li>
                    </ul>
                </p>
            </div>
        </div>
    );
}
