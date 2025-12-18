import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">Name</label>
                        <p className="text-gray-800 text-lg">{user?.name}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">Email</label>
                        <p className="text-gray-800 text-lg">{user?.email}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">Risk Preference</label>
                        <p className="text-gray-800 text-lg capitalize">{user?.riskPreference}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
