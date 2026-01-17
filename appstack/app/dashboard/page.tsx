'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus, X, ExternalLink } from 'lucide-react';

interface App {
    _id: string;
    name: string;
    description: string;
    logo: string;
    link: string;
    category: string;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [apps, setApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
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

    const groupedApps = apps.reduce((acc, app) => {
        if (!acc[app.category]) {
            acc[app.category] = [];
        }
        acc[app.category].push(app);
        return acc;
    }, {} as Record<string, App[]>);

    if (status === 'loading' || loading) {
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
}
