'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Package, Search, Filter, Eye, MoreHorizontal, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    shipping_address: any;
    user_id: string;
    payment_status: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        // Fetch orders with latest first
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-purple-100 text-purple-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-amber-100 text-amber-700'; // pending
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            JSON.stringify(order.shipping_address).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500 text-sm">Manage and track customer orders</p>
                </div>
                {/* Export / Actions could go here */}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                    />
                </div>
                <div className="flex gap-2 relative overflow-x-auto pb-2 md:pb-0">
                    {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-colors ${statusFilter === status
                                ? 'bg-navy-900 text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 size={40} className="animate-spin mb-4 text-navy-900" />
                        <p>Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#FAF9F7] text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono font-medium text-gray-900">
                                            #{order.id.slice(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                                            <div className="text-xs text-gray-400 font-normal">{order.shipping_address?.city}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            ₹{order.total_amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${order.payment_status === 'paid' ? 'bg-green-50 border-green-100 text-green-700' :
                                                order.payment_status === 'failed' ? 'bg-red-50 border-red-100 text-red-700' :
                                                    'bg-gray-50 border-gray-100 text-gray-600'
                                                }`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <button className="p-2 hover:bg-white bg-transparent rounded-lg text-gray-400 hover:text-navy-900 hover:shadow-sm border border-transparent hover:border-gray-200 transition-all">
                                                    <Eye size={18} />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination (Visual Only for now) */}
                {!loading && filteredOrders.length > 0 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        <span>Showing {filteredOrders.length} orders</span>
                        <div className="flex gap-2">
                            <button disabled className="p-2 border rounded-lg opacity-50 cursor-not-allowed"><ArrowLeft size={16} /></button>
                            <button disabled className="p-2 border rounded-lg opacity-50 cursor-not-allowed"><ArrowRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
