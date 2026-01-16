'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, ChevronLeft, ChevronRight, Star, LogOut, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Dummy app data
const appsData = [
    { id: 1, name: 'Instagram', icon: '📷', category: 'Social', rating: 4.5, downloads: '1B+', banner: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' },
    { id: 2, name: 'WhatsApp', icon: '💬', category: 'Communication', rating: 4.3, downloads: '5B+', banner: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' },
    { id: 3, name: 'TikTok', icon: '🎵', category: 'Entertainment', rating: 4.6, downloads: '1B+', banner: 'linear-gradient(135deg, #00f2ea 0%, #ff0050 100%)' },
    { id: 4, name: 'Spotify', icon: '🎧', category: 'Music', rating: 4.4, downloads: '500M+', banner: 'linear-gradient(135deg, #1DB954 0%, #191414 100%)' },
    { id: 5, name: 'Netflix', icon: '🎬', category: 'Entertainment', rating: 4.5, downloads: '500M+', banner: 'linear-gradient(135deg, #E50914 0%, #000000 100%)' },
    { id: 6, name: 'Telegram', icon: '✈️', category: 'Communication', rating: 4.6, downloads: '1B+', banner: 'linear-gradient(135deg, #0088cc 0%, #00bcd4 100%)' },
    { id: 7, name: 'Zoom', icon: '📹', category: 'Productivity', rating: 4.2, downloads: '500M+', banner: 'linear-gradient(135deg, #2D8CFF 0%, #0066FF 100%)' },
    { id: 8, name: 'Duolingo', icon: '🦉', category: 'Education', rating: 4.7, downloads: '100M+', banner: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)' },
    { id: 9, name: 'Candy Crush', icon: '🍬', category: 'Games', rating: 4.5, downloads: '1B+', banner: 'linear-gradient(135deg, #FF6B9D 0%, #C239B3 100%)' },
    { id: 10, name: 'PUBG Mobile', icon: '🎮', category: 'Games', rating: 4.3, downloads: '500M+', banner: 'linear-gradient(135deg, #FF6B00 0%, #FF0000 100%)' },
];

const featuredApps = appsData.slice(0, 5);
const recommendedApps = appsData.slice(2, 8);
const topCharts = appsData.slice(0, 6);
const trendingGames = appsData.filter(app => app.category === 'Games');

interface App {
    id: number;
    name: string;
    icon: string;
    category: string;
    rating: number;
    downloads: string;
    banner: string;
}

const AppCard = ({ app, featured = false }: { app: App; featured?: boolean }) => {
    if (featured) {
        return (
            <div className="min-w-[320px] md:min-w-[400px] h-48 rounded-2xl overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl">
                <div
                    className="w-full h-full p-6 flex flex-col justify-end text-white relative"
                    style={{ background: app.banner }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="relative z-10">
                        <div className="text-5xl mb-2">{app.icon}</div>
                        <h3 className="text-xl font-bold mb-1">{app.name}</h3>
                        <p className="text-sm opacity-90">{app.category}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="flex items-center gap-1 text-sm">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {app.rating}
                            </span>
                            <span className="text-sm opacity-75">{app.downloads}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-w-[140px] md:min-w-[160px] cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg">
            <div className="rounded-2xl overflow-hidden bg-gray-100 w-full aspect-square flex items-center justify-center text-5xl mb-2">
                {app.icon}
            </div>
            <h4 className="font-medium text-sm truncate mb-1 text-black">{app.name}</h4>
            <p className="text-xs text-black mb-1">{app.category}</p>
            <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-black">{app.rating}</span>
            </div>
        </div>
    );
};

const HorizontalScroll = ({ children, title }: { children: React.ReactNode; title: string }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        const ref = scrollRef.current;
        if (ref) {
            ref.addEventListener('scroll', checkScroll);
            return () => ref.removeEventListener('scroll', checkScroll);
        }
    }, [children]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black">{title}</h2>
                <div className="flex gap-2">
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors text-black"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    {canScrollRight && (
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors text-black"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {children}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('For you');
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = ['For you', 'Top charts', 'Kids', 'Events'];

    const filteredApps = searchQuery
        ? appsData.filter(app =>
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : appsData;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="flex items-center gap-4 px-4 py-3">

                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                            ▶
                        </div>
                        <span className="font-semibold text-xl hidden sm:block text-black">Google Play</span>
                    </div>

                    <div className="flex-1 max-w-2xl mx-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
                            <input
                                type="text"
                                placeholder="Search for apps & games"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black placeholder:text-black"
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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold cursor-pointer">
                            U
                        </div>
                    </div>
                </div>
            </header>

            <div>
                {/* Main Content */}
                <main className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
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

export default PlayStoreClone;
