'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus, X, ExternalLink, Sparkles, LogOut, Search, Layers, Settings } from 'lucide-react';

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
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: '',
        link: '',
        category: ''
    });

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('appstack-theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Save theme to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('appstack-theme', theme);
    }, [theme]);

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
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark'
                ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
                }`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <p className={`text-lg font-medium animate-pulse ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Loading your apps...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') return null;

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${theme === 'dark'
            ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
            : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
            }`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl animate-pulse ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-300/20'}`}></div>
                <div className={`absolute top-1/2 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-300/20'}`} style={{ animationDelay: '1s' }}></div>
                <div className={`absolute bottom-20 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse ${theme === 'dark' ? 'bg-pink-500/10' : 'bg-pink-300/20'}`} style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                            <Layers className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-3xl font-bold bg-clip-text text-transparent ${theme === 'dark'
                                ? 'bg-gradient-to-r from-white via-slate-200 to-slate-400'
                                : 'bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400'
                                }`}>
                                AppStack
                            </h1>
                            <p className={`mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                                Welcome back, <span className="text-purple-500 font-medium">{session?.user?.name || 'User'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {/* Search Bar */}
                        <div className="relative flex-1 md:flex-none md:w-72">
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                            <input
                                type="text"
                                placeholder="Search apps..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 ${theme === 'dark'
                                    ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500'
                                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 shadow-sm'
                                    }`}
                            />
                        </div>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            <span>Submit App</span>
                        </button>

                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className={`flex items-center gap-2 px-4 py-3 backdrop-blur-xl border rounded-xl transition-all duration-300 ${theme === 'dark'
                                ? 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-600'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 shadow-sm'
                                }`}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="hidden sm:inline">Settings</span>
                        </button>

                        <button
                            onClick={() => setShowSignOutModal(true)}
                            className={`flex items-center gap-2 px-4 py-3 backdrop-blur-xl border rounded-xl transition-all duration-300 ${theme === 'dark'
                                ? 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-600'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 shadow-sm'
                                }`}
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </header>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total Apps', value: apps.length, icon: '📱', color: 'from-blue-500/20 to-cyan-500/20' },
                        { label: 'Categories', value: Object.keys(groupedApps).length, icon: '📂', color: 'from-purple-500/20 to-pink-500/20' },
                        { label: 'Featured', value: Math.floor(apps.length / 2) || 0, icon: '⭐', color: 'from-amber-500/20 to-orange-500/20' },
                        { label: 'New This Week', value: Math.floor(apps.length / 3) || 0, icon: '🆕', color: 'from-emerald-500/20 to-teal-500/20' },
                    ].map((stat, index) => (
                        <div
                            key={stat.label}
                            className={`relative overflow-hidden bg-gradient-to-br ${stat.color} backdrop-blur-xl border rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-300 ${theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200/80 shadow-sm'
                                }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{stat.label}</p>
                                    <p className={`text-3xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
                                </div>
                                <span className="text-3xl opacity-80">{stat.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Apps Grid */}
                <div className="space-y-12">
                    {Object.entries(groupedApps).map(([category, categoryApps]) => {
                        const style = categoryStyles[category] || { gradient: 'from-slate-500 to-slate-400', icon: '📁' };
                        return (
                            <div key={category} className="animate-fadeIn">
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg`}>
                                        <span className="text-lg">{style.icon}</span>
                                    </div>
                                    <h2 className={`text-xl font-bold capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{category}</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {categoryApps.length} {categoryApps.length === 1 ? 'app' : 'apps'}
                                    </span>
                                </div>

                                {/* Apps Cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                                    {categoryApps.map((app, index) => (
                                        <a
                                            key={app._id}
                                            href={app.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className={`relative backdrop-blur-xl border rounded-2xl p-4 hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full ${theme === 'dark'
                                                ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600/50'
                                                : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md'
                                                }`}>
                                                {/* Glow effect on hover */}
                                                <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>

                                                <div className="relative flex flex-col items-center space-y-4">
                                                    {/* App Icon */}
                                                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl border overflow-hidden shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/10 transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700/50' : 'bg-gray-50 border-gray-200'
                                                        }`}>
                                                        {app.logo ? (
                                                            <img
                                                                src={app.logo}
                                                                alt={app.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className={`w-full h-full bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                                                                <span className="text-4xl">{style.icon}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* App Details */}
                                                    <div className="w-full text-center">
                                                        <h3 className={`font-semibold text-sm md:text-base truncate group-hover:text-purple-500 transition-colors duration-200 ${theme === 'dark' ? 'text-white' : 'text-gray-800'
                                                            }`}>
                                                            {app.name}
                                                        </h3>
                                                        <p className={`text-xs mt-1 truncate ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                                                            {app.description.substring(0, 30)}...
                                                        </p>
                                                    </div>

                                                    {/* External link indicator */}
                                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <ExternalLink className="w-4 h-4 text-purple-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Empty State */}
                    {filteredApps.length === 0 && apps.length > 0 && (
                        <div className="text-center py-20">
                            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
                                }`}>
                                <Search className={`w-10 h-10 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`} />
                            </div>
                            <p className={`text-lg mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>No apps match your search</p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>Try adjusting your search terms</p>
                        </div>
                    )}

                    {apps.length === 0 && (
                        <div className={`text-center py-20 backdrop-blur-xl rounded-3xl border border-dashed ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-200'
                            }`}>
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                <Sparkles className="w-12 h-12 text-purple-400" />
                            </div>
                            <p className={`text-xl font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>No apps yet</p>
                            <p className={`mb-6 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Be the first to submit an amazing app!</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
                            >
                                <Plus className="w-5 h-5" />
                                Submit Your First App
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Create App Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div
                        className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-purple-500/10 animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative p-6 border-b border-slate-700/50">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
                            <div className="relative flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Submit New App</h2>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleCreateApp} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">App Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                                    placeholder="e.g. MyAwesomeApp"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Category</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-slate-900">Select a category</option>
                                    <option value="Productivity" className="bg-slate-900">⚡ Productivity</option>
                                    <option value="Social" className="bg-slate-900">💬 Social</option>
                                    <option value="Entertainment" className="bg-slate-900">🎬 Entertainment</option>
                                    <option value="Utilities" className="bg-slate-900">🛠️ Utilities</option>
                                    <option value="Health" className="bg-slate-900">💪 Health & Fitness</option>
                                    <option value="Games" className="bg-slate-900">🎮 Games</option>
                                    <option value="Education" className="bg-slate-900">📚 Education</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">Logo URL</label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.logo}
                                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">App Link</label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 resize-none"
                                    rows={3}
                                    placeholder="Describe what makes your app awesome..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                🚀 Submit App
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Sign Out Confirmation Modal */}
            {showSignOutModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div
                        className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-red-500/10 animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative p-6 border-b border-slate-700/50">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"></div>
                            <div className="relative flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                        <LogOut className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Sign Out</h2>
                                </div>
                                <button
                                    onClick={() => setShowSignOutModal(false)}
                                    className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                                    <LogOut className="w-10 h-10 text-red-400" />
                                </div>
                                <p className="text-slate-300 text-lg mb-2">Are you sure you want to sign out?</p>
                                <p className="text-slate-500 text-sm">You will need to sign in again to access your dashboard.</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSignOutModal(false)}
                                    className="flex-1 py-3 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl font-medium hover:bg-slate-700/50 hover:text-white hover:border-slate-600 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => signOut({ redirect: false }).then(() => router.push('/login'))}
                                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettingsModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div
                        className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-purple-500/10 animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative p-6 border-b border-slate-700/50">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10"></div>
                            <div className="relative flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Settings</h2>
                                </div>
                                <button
                                    onClick={() => setShowSettingsModal(false)}
                                    className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Notification Settings */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Notifications</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all duration-300">
                                        <span className="text-white">Email Notifications</span>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-purple-500 rounded" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all duration-300">
                                        <span className="text-white">Push Notifications</span>
                                        <input type="checkbox" className="w-5 h-5 accent-purple-500 rounded" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all duration-300">
                                        <span className="text-white">App Updates</span>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-purple-500 rounded" />
                                    </label>
                                </div>
                            </div>

                            {/* Display Settings */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Display</h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-slate-800/30 rounded-xl">
                                        <label className="block text-white mb-2">Theme</label>
                                        <select
                                            value={theme}
                                            onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                        >
                                            <option value="dark">🌙 Dark Mode</option>
                                            <option value="light">☀️ Light Mode</option>
                                        </select>
                                    </div>
                                    <div className="p-3 bg-slate-800/30 rounded-xl">
                                        <label className="block text-white mb-2">Apps per Row</label>
                                        <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                                            <option value="4">4 Apps</option>
                                            <option value="5">5 Apps</option>
                                            <option value="6">6 Apps</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={() => {
                                    // Save settings logic here
                                    setShowSettingsModal(false);
                                }}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                💾 Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
