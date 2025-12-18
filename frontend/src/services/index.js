import api from './api';

export const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        return response.data;
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export const portfolioService = {
    getAll: async () => {
        const response = await api.get('/portfolios');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/portfolios/${id}`);
        return response.data;
    },

    create: async (portfolioData) => {
        const response = await api.post('/portfolios', portfolioData);
        return response.data;
    },

    update: async (id, portfolioData) => {
        const response = await api.put(`/portfolios/${id}`, portfolioData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/portfolios/${id}`);
        return response.data;
    }
};

export const holdingService = {
    getAll: async (portfolioId) => {
        const response = await api.get(`/holdings/portfolios/${portfolioId}/holdings`);
        return response.data;
    },

    create: async (portfolioId, holdingData) => {
        const response = await api.post(`/holdings/portfolios/${portfolioId}/holdings`, holdingData);
        return response.data;
    },

    update: async (id, holdingData) => {
        const response = await api.put(`/holdings/${id}`, holdingData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/holdings/${id}`);
        return response.data;
    },

    importCSV: async (portfolioId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/holdings/portfolios/${portfolioId}/holdings/import`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export const analyticsService = {
    getPortfolioAnalytics: async (portfolioId, benchmark = null) => {
        const params = benchmark ? { benchmark } : {};
        const response = await api.get(`/analytics/portfolios/${portfolioId}/analytics`, { params });
        return response.data;
    },

    getBenchmarkComparison: async (portfolioId, benchmark = 'NIFTY50', days = 30) => {
        const response = await api.get(`/analytics/portfolios/${portfolioId}/analytics/benchmark`, {
            params: { benchmark, days }
        });
        return response.data;
    }
};

export const alertService = {
    getAll: async (filters = {}) => {
        const response = await api.get('/alerts', { params: filters });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/alerts/${id}`);
        return response.data;
    },

    create: async (alertData) => {
        const response = await api.post('/alerts', alertData);
        return response.data;
    },

    update: async (id, alertData) => {
        const response = await api.put(`/alerts/${id}`, alertData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/alerts/${id}`);
        return response.data;
    },

    evaluate: async () => {
        const response = await api.post('/alerts/evaluate');
        return response.data;
    }
};

export const taxService = {
    getTaxReport: async (portfolioId, financialYear = null) => {
        const params = financialYear ? { financialYear } : {};
        const response = await api.get(`/tax/portfolios/${portfolioId}/tax-report`, { params });
        return response.data;
    },

    getFYWiseReport: async (portfolioId) => {
        const response = await api.get(`/tax/portfolios/${portfolioId}/tax-report/fy-wise`);
        return response.data;
    }
};
