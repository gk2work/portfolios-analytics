import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="text-xl font-bold text-primary-600">
                            📊 Trading Analytics
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                                Dashboard
                            </Link>
                            <Link to="/portfolios" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                                Portfolios
                            </Link>
                            <Link to="/alerts" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                                Alerts
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">👤 {user?.name}</span>
                        <Link to="/profile" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
