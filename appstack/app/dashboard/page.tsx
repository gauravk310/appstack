'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus, X, ExternalLink, Sparkles, LogOut, Search, Layers } from 'lucide-react';

interface App {
    _id: string;
    name: string;
    description: string;
    logo: string;
    link: string;
    category: string;
}

// Category icons and colors mapping
const categoryStyles: Record<string, { gradient: string; icon: string }> = {
    'Productivity': { gradient: 'from-blue-500 to-cyan-400', icon: '⚡' },
    'Social': { gradient: 'from-pink-500 to-rose-400', icon: '💬' },
    'Entertainment': { gradient: 'from-purple-500 to-indigo-400', icon: '🎬' },
    'Utilities': { gradient: 'from-emerald-500 to-teal-400', icon: '🛠️' },
    'Health': { gradient: 'from-green-500 to-lime-400', icon: '💪' },
    'Games': { gradient: 'from-orange-500 to-amber-400', icon: '🎮' },
    'Education': { gradient: 'from-violet-500 to-purple-400', icon: '📚' },
};

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [apps, setApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: '',
        link: '',
        category: ''
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchApps();
        }
    }, [status, router]);

    const fetchApps = async () => {
        try {
            const res = await fetch('/api/apps');
            const data = await res.json();
            if (data.success) {
                setApps(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch apps:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateApp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/apps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setApps([data.data, ...apps]);
                setShowCreateModal(false);
                setFormData({ name: '', description: '', logo: '', link: '', category: '' });
            }
        } catch (error) {
            console.error('Failed to create app:', error);
        }
    };

    const filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedApps = filteredApps.reduce((acc, app) => {
        if (!acc[app.category]) {
            acc[app.category] = [];
        }
        acc[app.category].push(app);
        return acc;
    }, {} as Record<string, App[]>);

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-lg font-medium animate-pulse">Loading your apps...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                            <Layers className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                                AppStack
                            </h1>
                            <p className="text-slate-400 mt-0.5">
                                Welcome back, <span className="text-purple-400 font-medium">{session?.user?.name || 'User'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {/* Search Bar */}
                        <div className="relative flex-1 md:flex-none md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search apps..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                            />
                        </div>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                            <Plus className="w-5 h-5" />
                            Submit App
                        </button>
                        <button
                            onClick={() => signOut({ redirect: false }).then(() => router.push('/login'))}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                <div className="space-y-12">
                    {Object.entries(groupedApps).map(([category, categoryApps]) => (
                        <div key={category}>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">{category}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {categoryApps.map((app) => (
                                    <a
                                        key={app._id}
                                        href={app.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block"
                                    >
                                        <div className="bg-transparent hover:bg-gray-100/50 rounded-xl p-3 transition-colors duration-200 cursor-pointer h-full">
                                            <div className="flex flex-col items-center md:items-start space-y-3">
                                                {/* App Icon */}
                                                <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group-hover:shadow-md transition-shadow relative grid place-items-center">
                                                    {app.logo ? (
                                                        <img
                                                            src={app.logo}
                                                            alt={app.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-4xl">📱</span>
                                                    )}
                                                </div>

                                                {/* App Details */}
                                                <div className="w-full text-center md:text-left">
                                                    <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate group-hover:text-purple-600 transition-colors">
                                                        {app.name}
                                                    </h3>
                                                    <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                                        <p className="truncate">{app.category}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}

                    {apps.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">No apps found. Be the first to submit one!</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="text-purple-600 font-medium hover:text-purple-700"
                            >
                                Submit an App
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Create App Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">Submit New App</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateApp} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="e.g. MyApp"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                                >
                                    <option value="">Select a category</option>
                                    <option value="Productivity">Productivity</option>
                                    <option value="Social">Social</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Health">Health & Fitness</option>
                                    <option value="Games">Games</option>
                                    <option value="Education">Education</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.logo}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">App Link</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    rows={3}
                                    placeholder="Describe your app..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
                            >
                                Submit App
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
