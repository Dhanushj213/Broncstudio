'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, PackageCheck, Clock } from 'lucide-react';

export default function OrderPreview() {
    const orders = [
        { id: '#ORD-9281', item: 'Little Explorer T-Shirt + 2 items', date: 'Jan 24, 2026', status: 'Processing', total: '₹1499', icon: Clock, statusColor: 'text-orange-600 bg-orange-50' },
        { id: '#ORD-8821', item: 'Space Stories Bedseet', date: 'Dec 12, 2025', status: 'Delivered', total: '₹2299', icon: PackageCheck, statusColor: 'text-green-600 bg-green-50' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-navy-900">Recent Orders</h3>
                <Link href="/profile/orders" className="text-sm font-bold text-coral-500 hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
                {orders.map((order, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${order.statusColor}`}>
                            <order.icon size={18} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-navy-900 group-hover:text-coral-500 transition-colors">{order.item}</h4>
                                <span className="text-sm font-bold text-navy-900">{order.total}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-400">{order.id} • {order.date}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${order.statusColor}`}>{order.status}</span>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-navy-900 mt-2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
