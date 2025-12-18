import { useParams } from 'react-router-dom';

export default function TaxReport() {
    const { id } = useParams();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Tax Report</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600">
                    Tax estimation report coming soon. Portfolio ID: {id}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                    This page will include:
                    <ul className="list-disc ml-6 mt-2">
                        <li>STCG/LTCG breakdown</li>
                        <li>Equity vs Non-Equity classification</li>
                        <li>FY-wise tax reports</li>
                        <li>Estimated tax liability</li>
                    </ul>
                </p>
            </div>
        </div>
    );
}
