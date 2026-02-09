'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Truck, Search, ExternalLink, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface ShippingOrder {
    id: string;
    created_at: string;
    status: string;
    shipping_address: any;
    user_id: string;
    items_count?: number;
}

export default function ShippingPage() {
    const [orders, setOrders] = useState<ShippingOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unshipped' | 'shipped'>('unshipped');
    const [searchTerm, setSearchTerm] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchShippingOrders();
    }, []);

    const fetchShippingOrders = async () => {
        setLoading(true);
        // Fetch orders that are NOT cancelled or rejected or pending (unpaid/unverified)
        // Focus on Processing (Unshipped), Shipped, Delivered
        const { data, error } = await supabase
            .from('orders')
            .select('id, created_at, status, shipping_address, user_id')
            .in('status', ['processing', 'shipped', 'delivered'])
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            // Mock items count since we didn't join
            const ordersWithMeta = data?.map(o => ({ ...o, items_count: 1 })) || [];
            setOrders(ordersWithMeta);
        }
        setLoading(false);
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch =
            o.id.includes(searchTerm) ||
            o.shipping_address?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.shipping_address?.city?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'unshipped') return matchesSearch && o.status === 'processing';
        if (filter === 'shipped') return matchesSearch && (o.status === 'shipped' || o.status === 'delivered');

        return matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Truck size={24} className="text-navy-900" />
                        Shipping & Logistics
                    </h1>
                    <p className="text-gray-500 mt-1">Manage shipments and track deliveries.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex gap-1 w-fit">
                    <button
                        onClick={() => setFilter('unshipped')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'unshipped' ? 'bg-navy-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        To Ship ({orders.filter(o => o.status === 'processing').length})
                    </button>
                    <button
                        onClick={() => setFilter('shipped')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'shipped' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Shipped / Delivered
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        All
                    </button>
                </div>

                <div className="relative flex-1 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search Order ID, Name, City..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 rounded-lg focus:outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#FAF9F7] text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Order Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Destination</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading shipments...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No shipments found.</td></tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <Link href={`/admin/orders/${order.id}`} className="font-bold text-gray-900 hover:text-blue-600 hover:underline">
                                                    #{order.id.slice(0, 8)}
                                                </Link>
                                                <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                    <Calendar size={12} /> {format(new Date(order.created_at), 'MMM d, yyyy')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{order.shipping_address?.firstName} {order.shipping_address?.lastName}</p>
                                            <p className="text-xs text-gray-500">{order.shipping_address?.phone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <p>{order.shipping_address?.city}</p>
                                            <p className="text-xs text-gray-400">{order.shipping_address?.pincode}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${order.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {order.status === 'processing' ? 'Pending Ship' : order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <button className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1 ml-auto">
                                                    Manage <ExternalLink size={12} />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
