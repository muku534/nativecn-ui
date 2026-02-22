'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, Eye, Copy, ExternalLink, Users,
    Lock, LogOut, TrendingUp, Code2, Search as SearchIcon,
    ShieldCheck, LayoutTemplate, MousePointerClick, Download,
    ClipboardCopy, Code, Settings
} from 'lucide-react';
import {
    getAllComponentStats,
    getGlobalCounters,
    isAdminAuthenticated,
    adminLogin,
    logoutAdmin,
} from '@/lib/analytics';

interface ComponentStats {
    views: number;
    copies: number;
    snack_opens: number;
}

interface GlobalCounters {
    dev_count: number;
    total_views: number;
    total_copies: number;
    total_snack_opens: number;
    total_studio_landing_views?: number;
    total_studio_builder_views?: number;
    total_studio_exports?: number;
    total_studio_copies?: number;
    total_studio_props_updates?: number;
    total_studio_code_views?: number;
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await adminLogin(username, password);

        if (result.success) {
            onSuccess();
        } else {
            setError(result.error || 'Invalid credentials');
            setPassword('');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-background border border-border rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Admin access required</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Admin username"
                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                autoFocus
                                autoComplete="username"
                                disabled={isLoading}
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Admin password"
                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                autoComplete="current-password"
                                disabled={isLoading}
                            />
                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading || !username || !password}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Access Dashboard'}
                            </button>
                        </div>
                    </form>

                    <p className="text-xs text-muted-foreground text-center mt-6 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Protected admin resource
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
    icon: Icon,
    label,
    value,
    gradient,
    delay = 0,
}: {
    icon: any;
    label: string;
    value: string | number;
    gradient: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="bg-background border border-border rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-muted-foreground font-medium">{label}</span>
            </div>
            <p className="text-3xl font-bold">{value}</p>
        </motion.div>
    );
}

// ─── Component Rank Table ────────────────────────────────────────────────────

function RankTable({
    title,
    data,
    field,
    icon: Icon,
    delay = 0,
}: {
    title: string;
    data: [string, ComponentStats][];
    field: 'views' | 'copies' | 'snack_opens';
    icon: any;
    delay?: number;
}) {
    const sorted = [...data].sort((a, b) => b[1][field] - a[1][field]);
    const maxValue = sorted.length > 0 ? sorted[0][1][field] : 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="bg-background border border-border rounded-2xl p-6"
        >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon className="w-5 h-5 text-blue-500" /> {title}
            </h3>
            {sorted.length === 0 ? (
                <p className="text-muted-foreground text-sm py-8 text-center">No data yet</p>
            ) : (
                <div className="space-y-3">
                    {sorted.map(([id, stats], i) => (
                        <div key={id} className="group">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground w-5 text-right">
                                        #{i + 1}
                                    </span>
                                    <span className="text-sm font-medium capitalize">
                                        {id.replace(/-/g, ' ')}
                                    </span>
                                </div>
                                <span className="text-sm font-bold tabular-nums">
                                    {stats[field].toLocaleString()}
                                </span>
                            </div>
                            <div className="ml-7 h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(stats[field] / maxValue) * 100}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.05 }}
                                    className={`h-full rounded-full ${field === 'views'
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                        : field === 'copies'
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                            : 'bg-gradient-to-r from-orange-500 to-yellow-500'
                                        }`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard() {
    const [globalCounters, setGlobalCounters] = useState<GlobalCounters>({
        dev_count: 175,
        total_views: 0,
        total_copies: 0,
        total_snack_opens: 0,
        total_studio_landing_views: 0,
        total_studio_builder_views: 0,
        total_studio_exports: 0,
        total_studio_copies: 0,
        total_studio_props_updates: 0,
        total_studio_code_views: 0,
    });
    const [componentStats, setComponentStats] = useState<Record<string, ComponentStats>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const [counters, stats] = await Promise.all([
                getGlobalCounters(),
                getAllComponentStats(),
            ]);
            setGlobalCounters(counters);
            setComponentStats(stats);
            setIsLoading(false);
        }
        loadData();
    }, []);

    const handleLogout = async () => {
        await logoutAdmin();
        window.location.reload();
    };

    const statsEntries = Object.entries(componentStats);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold">Analytics</h1>
                        </div>
                        <p className="text-muted-foreground">Platform engagement and component metrics</p>
                    </motion.div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-sm font-medium transition"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={Users}
                        label="Total Developers"
                        value={`${globalCounters.dev_count}+`}
                        gradient="from-blue-500 to-cyan-500"
                        delay={0}
                    />
                    <StatCard
                        icon={Eye}
                        label="Component Views"
                        value={globalCounters.total_views.toLocaleString()}
                        gradient="from-green-500 to-emerald-500"
                        delay={0.1}
                    />
                    <StatCard
                        icon={Copy}
                        label="Code Copies"
                        value={globalCounters.total_copies.toLocaleString()}
                        gradient="from-purple-500 to-pink-500"
                        delay={0.2}
                    />
                    <StatCard
                        icon={ExternalLink}
                        label="Snack Opens"
                        value={globalCounters.total_snack_opens.toLocaleString()}
                        gradient="from-orange-500 to-yellow-500"
                        delay={0.3}
                    />
                </div>

                {/* Form Studio Analytics Section */}
                <div className="mb-4 flex items-center gap-2 px-1">
                    <LayoutTemplate className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-bold">Form Studio Performance</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    <StatCard
                        icon={Eye}
                        label="Landing Views"
                        value={(globalCounters.total_studio_landing_views || 0).toLocaleString()}
                        gradient="from-indigo-500 to-blue-500"
                        delay={0.2}
                    />
                    <StatCard
                        icon={MousePointerClick}
                        label="Builder Sessions"
                        value={(globalCounters.total_studio_builder_views || 0).toLocaleString()}
                        gradient="from-blue-500 to-cyan-500"
                        delay={0.25}
                    />
                    <StatCard
                        icon={Settings}
                        label="Prop Updates"
                        value={(globalCounters.total_studio_props_updates || 0).toLocaleString()}
                        gradient="from-cyan-500 to-teal-500"
                        delay={0.3}
                    />
                    <StatCard
                        icon={Code}
                        label="Code Views"
                        value={(globalCounters.total_studio_code_views || 0).toLocaleString()}
                        gradient="from-amber-400 to-orange-500"
                        delay={0.35}
                    />
                    <StatCard
                        icon={ClipboardCopy}
                        label="Code Copies"
                        value={(globalCounters.total_studio_copies || 0).toLocaleString()}
                        gradient="from-orange-500 to-red-500"
                        delay={0.4}
                    />
                    <StatCard
                        icon={Download}
                        label="Studio Exports"
                        value={(globalCounters.total_studio_exports || 0).toLocaleString()}
                        gradient="from-red-500 to-pink-500"
                        delay={0.45}
                    />
                </div>

                {/* Component Rankings */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    <RankTable
                        title="Most Viewed"
                        data={statsEntries}
                        field="views"
                        icon={Eye}
                        delay={0.3}
                    />
                    <RankTable
                        title="Most Copied"
                        data={statsEntries}
                        field="copies"
                        icon={Code2}
                        delay={0.4}
                    />
                    <RankTable
                        title="Most Snack Opens"
                        data={statsEntries}
                        field="snack_opens"
                        icon={ExternalLink}
                        delay={0.5}
                    />
                </div>

                {/* Detailed Component Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-background border border-border rounded-2xl overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-border bg-muted/30">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" /> All Components
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Component</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold">Views</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold">Copies</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold">Snack Opens</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold">Engagement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {statsEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            No component data yet. Data will appear as users interact with components.
                                        </td>
                                    </tr>
                                ) : (
                                    [...statsEntries]
                                        .sort((a, b) => (b[1].views + b[1].copies) - (a[1].views + a[1].copies))
                                        .map(([id, stats]) => {
                                            const total = stats.views + stats.copies + stats.snack_opens;
                                            return (
                                                <tr key={id} className="hover:bg-muted/30 transition">
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium capitalize">
                                                            {id.replace(/-/g, ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right tabular-nums">{stats.views.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right tabular-nums">{stats.copies.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right tabular-nums">{stats.snack_opens.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="font-bold tabular-nums">{total.toLocaleString()}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Firebase Console Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-8 p-6 bg-gradient-to-br from-muted/50 to-muted/30 border border-border rounded-2xl text-center"
                >
                    <p className="text-sm text-muted-foreground mb-3">
                        For detailed engagement data (device types, browsers, traffic sources, geography), visit:
                    </p>
                    <a
                        href="https://console.firebase.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                        <BarChart3 className="w-4 h-4" /> Open Firebase Console
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
        </div>
    );
}

// ─── Page Entry ──────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const authenticated = await isAdminAuthenticated();
            setIsAuthenticated(authenticated);
            setIsChecking(false);
        }
        checkAuth();
    }, []);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginScreen onSuccess={() => setIsAuthenticated(true)} />;
    }

    return <Dashboard />;
}
