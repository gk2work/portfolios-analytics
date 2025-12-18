import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Holdings from './pages/Holdings';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import TaxReport from './pages/TaxReport';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Layout Component
const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
                path="/signup"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
            />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/portfolios"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Portfolio />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/portfolios/:id/holdings"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Holdings />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/portfolios/:id/analytics"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Analytics />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/alerts"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Alerts />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/portfolios/:id/tax-report"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <TaxReport />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Profile />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
