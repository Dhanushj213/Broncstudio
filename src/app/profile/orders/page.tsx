'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, ChevronRight } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function OrdersPage() {
    const { formatPrice } = useUI();

    // Mock Orders
    const orders = [
        {
            id: 'ORD-9281',
            date: 'Jan 24, 2026',
            status: 'Processing',
            statusColor: 'bg-orange-100 text-orange-600',
            total: 1499,
            items: ['Little Explorer T-Shirt', '2 items']
        },
        {
            id: 'ORD-8821',
            date: 'Dec 12, 2025',
            status: 'Delivered',
            statusColor: 'bg-green-100 text-green-600',
            total: 2299,
            items: ['Space Stories Bedseet']
        },
        {
            id: 'ORD-7732',
            date: 'Nov 05, 2025',
            status: 'Delivered',
            statusColor: 'bg-green-100 text-green-600',
            total: 4500,
            items: ['Premium Wooden Puzzle Set']
        },
        {
            id: 'ORD-6543',
            date: 'Oct 20, 2025',
            status: 'Cancelled',
            statusColor: 'bg-red-100 text-red-600',
            total: 899,
            items: ['Everyday Cap']
        }
    ];

    return (
        <main className="bg-[#FAF9F7] min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[800px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/profile" className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm">
                        <ArrowLeft size={20} className="text-navy-900" />
                    </Link>
                    <h1 className="text-2xl font-bold text-navy-900 font-heading">My Orders</h1>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.statusColor}`}>
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-navy-900">{order.items[0]} <span className="text-gray-400 font-normal">{order.items.length > 1 ? `+ ${order.items[1]}` : ''}</span></h3>
                                        <p className="text-xs text-gray-500">#{order.id} • {order.date}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${order.statusColor}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <div className="text-sm font-bold text-navy-900">
                                    Total: {formatPrice(order.total)}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-coral-500 group-hover:underline">
                                    View Details <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
