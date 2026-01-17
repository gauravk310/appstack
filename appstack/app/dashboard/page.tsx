'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="flex items-center gap-4 px-4 py-3">

                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            ▶
                        </div>
                        <span className="font-semibold text-xl hidden sm:block text-black">AppStack</span>
                    </div>

                    <div className="flex-1 max-w-2xl mx-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
                            <input
                                type="text"
                                placeholder="Search for apps & games"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-black placeholder:text-black"
                            />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell className="w-6 h-6 text-black" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Settings className="w-6 h-6 text-black" />
                        </button>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="font-semibold text-gray-900">{session?.user?.name}</p>
                                        <p className="text-sm text-gray-500">{session?.user?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => router.push('/profile')}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <User className="w-5 h-5" />
                                        <span>Profile</span>
                                    </button>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div>
                {/* Main Content */}
                <main className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
                    {/* Welcome Banner */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl text-white">
                        <h1 className="text-2xl font-bold mb-2">
                            Welcome back, {session?.user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="opacity-90">Discover your next favorite app today</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 mb-6 border-b overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 px-2 font-medium whitespace-nowrap transition-colors ${activeTab === tab
                                    ? 'text-black border-b-2 border-black'
                                    : 'text-black hover:text-black'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {searchQuery ? (
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-black">Search Results</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredApps.map(app => (
                                    <AppCard key={app.id} app={app} />
                                ))}
                            </div>
                            {filteredApps.length === 0 && (
                                <p className="text-center text-black py-12">No apps found</p>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Featured Carousel */}
                            <HorizontalScroll title="Featured">
                                {featuredApps.map(app => (
                                    <AppCard key={app.id} app={app} featured />
                                ))}
                            </HorizontalScroll>

                            {/* Recommended */}
                            <HorizontalScroll title="Recommended for you">
                                {recommendedApps.map(app => (
                                    <AppCard key={app.id} app={app} />
                                ))}
                            </HorizontalScroll>

                            {/* Top Charts */}
                            <HorizontalScroll title="Top charts">
                                {topCharts.map(app => (
                                    <AppCard key={app.id} app={app} />
                                ))}
                            </HorizontalScroll>

                            {/* Trending Games */}
                            <HorizontalScroll title="Trending games">
                                {trendingGames.map(app => (
                                    <AppCard key={app.id} app={app} />
                                ))}
                            </HorizontalScroll>

                            {/* New & Updated */}
                            <HorizontalScroll title="New & updated apps">
                                {appsData.slice(3, 9).map(app => (
                                    <AppCard key={app.id} app={app} />
                                ))}
                            </HorizontalScroll>

                            {/* Editor's Choice */}
                            <HorizontalScroll title="Editor's Choice">
                                {appsData.slice(1, 7).map(app => (
                                    <AppCard key={app.id} app={app} />
                                ))}
                            </HorizontalScroll>
                        </>
                    )}
                </main>
            </div>

            <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
