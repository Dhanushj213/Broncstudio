'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { format } from 'date-fns';

// --- Types ---
interface DailyStat {
    date: string; // ISO date string or formatted date
    revenue: number;
    orders: number;
}

interface PaymentStat {
    name: string;
    value: number;
}

interface StatusStat {
    name: string;
    value: number;
}

interface AnalyticsChartsProps {
    dailyStats: DailyStat[];
    paymentStats: PaymentStat[];
    statusStats: StatusStat[];
}

// --- Colors ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const STATUS_COLORS: Record<string, string> = {
    pending: '#F59E0B',
    processing: '#3B82F6',
    shipped: '#6366F1',
    delivered: '#10B981',
    cancelled: '#EF4444',
    returned: '#8B5CF6'
};

export default function AnalyticsCharts({ dailyStats, paymentStats, statusStats }: AnalyticsChartsProps) {

    // Formatting currency
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

    return (
        <div className="space-y-6">

            {/* Row 1: Revenue & Orders Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue & Orders Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => {
                                        try { return format(new Date(str), 'MMM d'); } catch { return str; }
                                    }}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    yAxisId="left"
                                    tickFormatter={(val) => `₹${val / 1000}k`}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <Tooltip
                                    formatter={(value: number | undefined, name: string | undefined) => [
                                        name === 'revenue' ? formatCurrency(value || 0) : value || 0,
                                        name === 'revenue' ? 'Revenue' : 'Orders'
                                    ]}
                                    labelFormatter={(label) => {
                                        try { return format(new Date(label), 'PPP'); } catch { return label; }
                                    }}
                                />
                                <Legend />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    name="Revenue"
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#82ca9d"
                                    fillOpacity={1}
                                    fill="url(#colorOrders)"
                                    name="Orders"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Breakdown (Pie) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val: number | undefined) => [val || 0, 'Orders']} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Row 2: Payment Methods */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={paymentStats}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: '#F3F4F6' }} />
                            <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20}>
                                {paymentStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}
