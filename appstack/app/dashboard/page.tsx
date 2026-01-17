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
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (status === 'unauthenticated') return null;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="mb-4">Welcome, {session?.user?.name || 'User'}!</p>
            <button
                onClick={() => signOut({ redirect: false }).then(() => router.push('/login'))}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
                Sign Out
            </button>
        </div>
    );
};

export default Dashboard;
