export default function Alerts() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Smart Alerts</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600">
                    Alert management system coming soon.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                    Features:
                    <ul className="list-disc ml-6 mt-2">
                        <li>Price breakout alerts</li>
                        <li>Volume spike alerts</li>
                        <li>RSI overbought/oversold alerts</li>
                        <li>Percentage move alerts</li>
                    </ul>
                </p>
            </div>
        </div>
    );
}
