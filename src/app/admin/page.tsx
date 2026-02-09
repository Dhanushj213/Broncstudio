'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { DollarSign, ShoppingBag, Package, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, AlertTriangle, Plus, RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { AdminDateProvider, useAdminDate } from '@/components/admin/AdminDateContext';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import { format, isSameDay, parseISO, startOfDay } from 'date-fns';

function DashboardContent() {
    const { rangeType, setRangeType, dateRange } = useAdminDate();

    // Stats State
    const [stats, setStats] = useState({
        revenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        lowStock: 0,
        avgOrderValue: 0
    });

    // Chart Data State
    const [dailyStats, setDailyStats] = useState<any[]>([]);
    const [paymentStats, setPaymentStats] = useState<any[]>([]);
    const [statusStats, setStatusStats] = useState<any[]>([]);

    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [health, setHealth] = useState({ latency: 0, status: 'Checking...' });
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const checkDatabaseHealth = async () => {
            // Keep existing health check logic...
            setHealth(prev => ({ ...prev, status: 'Checking...' }));
            const start = performance.now();
            await supabase.from('orders').select('id').limit(1);
            const end = performance.now();
            const latency = Math.round(end - start);
            setHealth({
                latency,
                status: latency < 300 ? 'Healthy' : latency < 800 ? 'Moderate' : 'Degraded'
            });
        };

        const fetchData = async () => {
            setLoading(true);

            // 1. Build Query with Date Filter
            let query = supabase.from('orders').select('id, created_at, total_amount, status, payment_method, wallet_amount_used');

            if (dateRange.from) {
                query = query.gte('created_at', dateRange.from.toISOString());
            }
            if (dateRange.to) {
                query = query.lte('created_at', dateRange.to.toISOString());
            }

            const { data: orders, error } = await query;
            const { count: lowStockCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).lt('stock_quantity', 10);

            if (orders) {
                // Key Stats
                const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
                const pending = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
                const aov = orders.length > 0 ? totalRevenue / orders.length : 0;

                setStats({
                    revenue: totalRevenue,
                    totalOrders: orders.length,
                    pendingOrders: pending,
                    lowStock: lowStockCount || 0,
                    avgOrderValue: parseFloat(aov.toFixed(2))
                });

                // --- Process Chart Data ---

                // 1. Daily Stats (Revenue & Orders)
                // Map to dictionary to aggregate same days
                const dailyMap: Record<string, { revenue: number, orders: number, date: string }> = {};

                orders.forEach(order => {
                    const dateKey = format(parseISO(order.created_at), 'yyyy-MM-dd');
                    if (!dailyMap[dateKey]) {
                        dailyMap[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
                    }
                    dailyMap[dateKey].revenue += order.total_amount || 0;
                    dailyMap[dateKey].orders += 1;
                });

                // Sort by date
                const sortedDaily = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
                setDailyStats(sortedDaily);

                // 2. Payment Stats
                const payMap: Record<string, number> = {};
                orders.forEach(order => {
                    const method = order.payment_method || 'Unknown';
                    payMap[method] = (payMap[method] || 0) + 1;
                });
                setPaymentStats(Object.keys(payMap).map(key => ({ name: key, value: payMap[key] })));

                // 3. Status Stats
                const statusMap: Record<string, number> = {};
                orders.forEach(order => {
                    const s = order.status || 'Unknown';
                    statusMap[s] = (statusMap[s] || 0) + 1;
                });
                setStatusStats(Object.keys(statusMap).map(key => ({ name: key, value: statusMap[key] })));
            }

            if (error) {
                console.error("Dashboard Fetch Error:", error);
            }

            // 2. Fetch Recent Orders (Limit 5, ignore date range for "Recent" context usually, but let's keep it global if desired. 
            // Actually "Recent" usually means absolute recent. Let's keep it absolute for now.)
            const { data: recent } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5);
            if (recent) setRecentOrders(recent);

            // 3. Check Health
            await checkDatabaseHealth();

            setLoading(false);
        };

        fetchData();
    }, [dateRange, supabase]); // Re-fetch when dateRange changes

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">
                        {dateRange.label === 'All Time'
                            ? 'Showing all time data.'
                            : `Showing data for ${dateRange.label} (${dateRange.from ? format(dateRange.from, 'MMM d') : ''} - ${dateRange.to ? format(dateRange.to, 'MMM d') : ''})`}
                    </p>
                </div>

                {/* Date Toggles */}
                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-1">
                    {(['today', 'yesterday', 'last7', 'thisMonth', 'all'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setRangeType(type)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${rangeType === type
                                ? 'bg-navy-900 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {type === 'last7' ? 'Last 7 Days' : type === 'thisMonth' ? 'This Month' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                            <DollarSign size={24} />
                        </div>
                        {/* Example Trend indicator (static for now) */}
                        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <TrendingUp size={12} className="mr-1" /> +12%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {loading ? '...' : formatCurrency(stats.revenue)}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                </div>

                {/* Total Orders */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {loading ? '...' : stats.totalOrders}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                </div>

                {/* Avg Order Value */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-violet-50 text-violet-600">
                            <ArrowUpRight size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {loading ? '...' : formatCurrency(stats.avgOrderValue)}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                </div>

                {/* Low Stock (Independent of date range usually) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50 text-red-600">
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {loading ? '...' : stats.lowStock}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                </div>
            </div>

            {/* Visual Analytics */}
            <div>
                <AnalyticsCharts
                    dailyStats={dailyStats}
                    paymentStats={paymentStats}
                    statusStats={statusStats}
                />
            </div>

            {/* Recent Orders & Quick Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                        <Link href="/admin/orders" className="bg-navy-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-navy-800 shadow-md transition-all">
                            View All Orders
                        </Link>
                    </div>
                    {recentOrders.length === 0 && !loading ? (
                        <div className="p-8 text-center text-gray-400">No orders placed yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">#{order.id.slice(0, 8)}</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {order.shipping_address?.firstName || 'Guest'}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(order.total_amount)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Actions / Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="space-y-4">
                        <Link href="/admin/products/new">
                            <button className="w-full py-3 px-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-navy-900/20">
                                <Plus size={20} /> Add Product
                            </button>
                        </Link>
                        <Link href="/admin/orders">
                            <button className="w-full py-3 px-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                <ShoppingBag size={18} /> View All Orders
                            </button>
                        </Link>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">System Health</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                                    <span>Database Latency</span>
                                    <span className={`${health.status === 'Healthy' ? 'text-green-600' : health.status === 'Moderate' ? 'text-amber-600' : 'text-red-600'}`}>
                                        {health.status} ({health.latency}ms)
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${health.status === 'Healthy' ? 'bg-green-500' : health.status === 'Moderate' ? 'bg-amber-500' : 'bg-red-500'}`}
                                        style={{ width: health.status === 'Checking...' ? '0%' : '100%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <AdminDateProvider>
            <DashboardContent />
        </AdminDateProvider>
    );
}
