'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Truck, CheckCircle, Clock, Package, Search } from 'lucide-react';
import Link from 'next/link';

interface Order {
    id: string;
    created_at: string;
    status: string;
    shipping_address: any;
    items?: any[]; // For count
}

export default function ShippingPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, processing (ready), shipped

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        // Fetch orders that are NOT cancelled or pending (assuming pending means not yet accepted by admin)
        // Actually, "Processing" = Ready to Ship. "Shipped" = Shipped.
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .in('status', ['processing', 'shipped', 'delivered'])
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const markAsShipped = async (orderId: string) => {
        if (!confirm('Mark this order as Shipped?')) return;

        const { error } = await supabase
            .from('orders')
            .update({ status: 'shipped' })
            .eq('id', orderId);

        if (!error) {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'shipped' } : o));
        }
    };

    const filteredOrders = orders.filter(o => {
        if (filter === 'ready') return o.status === 'processing';
        if (filter === 'shipped') return o.status === 'shipped' || o.status === 'delivered';
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Shipping & Fulfillment</h1>
                    <p className="text-gray-500 text-sm">Manage order delivery status</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setFilter('all')}
                    className={`pb-3 px-1 text-sm font-bold transition-colors border-b-2 ${filter === 'all' ? 'border-navy-900 text-navy-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    All Shipments
                </button>
                <button
                    onClick={() => setFilter('ready')}
                    className={`pb-3 px-1 text-sm font-bold transition-colors border-b-2 ${filter === 'ready' ? 'border-navy-900 text-navy-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Ready to Ship
                </button>
                <button
                    onClick={() => setFilter('shipped')}
                    className={`pb-3 px-1 text-sm font-bold transition-colors border-b-2 ${filter === 'shipped' ? 'border-navy-900 text-navy-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Shipped / Delivered
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-100">
                        <Truck size={40} className="mx-auto mb-4 opacity-20" />
                        <p>No shipments found for this filter.</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${order.status === 'processing' ? 'bg-amber-50 text-amber-600' :
                                        order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                                            'bg-green-50 text-green-600'
                                    }`}>
                                    <Package size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-navy-900">Order #{order.id.slice(0, 8)}</h3>
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded capitalize ${order.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {order.status === 'processing' ? 'Ready to Ship' : order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {order.shipping_address?.firstName} {order.shipping_address?.lastName}, {order.shipping_address?.city}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Ordered: {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-end md:self-center">
                                <Link href={`/admin/orders/${order.id}`}>
                                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">
                                        View Details
                                    </button>
                                </Link>
                                {order.status === 'processing' && (
                                    <button
                                        onClick={() => markAsShipped(order.id)}
                                        className="px-4 py-2 bg-navy-900 text-white rounded-lg text-sm font-bold hover:bg-navy-800 flex items-center gap-2"
                                    >
                                        <Truck size={16} /> Mark Shipped
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
