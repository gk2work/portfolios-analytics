import { useState, useEffect } from 'react';
import { portfolioService } from '../services';

export default function Portfolio() {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        loadPortfolios();
    }, []);

    const loadPortfolios = async () => {
        try {
            const data = await portfolioService.getAll();
            setPortfolios(data.portfolios);
        } catch (err) {
            console.error('Failed to load portfolios:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await portfolioService.create(formData);
            setFormData({ name: '', description: '' });
            setShowForm(false);
            loadPortfolios();
        } catch (err) {
            alert('Failed to create portfolio');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this portfolio?')) {
            try {
                await portfolioService.delete(id);
                loadPortfolios();
            } catch (err) {
                alert('Failed to delete portfolio');
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center"><div className="spinner"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Portfolios</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
                >
                    {showForm ? 'Cancel' : '+ New Portfolio'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Create New Portfolio</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                                rows="3"
                            />
                        </div>
                        <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-md">
                            Create Portfolio
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.map(portfolio => (
                    <div key={portfolio._id} className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{portfolio.name}</h3>
                        <p className="text-gray-600 mb-4">{portfolio.description || 'No description'}</p>
                        <div className="flex space-x-2">
                            <a
                                href={`/portfolios/${portfolio._id}/holdings`}
                                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm"
                            >
                                View Holdings
                            </a>
                            <button
                                onClick={() => handleDelete(portfolio._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
