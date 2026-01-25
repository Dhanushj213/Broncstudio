'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Clock, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useParams } from 'next/navigation';

export default function OrderDetailsPage() {
    const { formatPrice } = useUI();
    const params = useParams();
    const orderId = params?.id || 'ORD-0000';

    // Mock Data based on ID (simplified logic)
    const order = {
        id: orderId,
        date: 'Jan 24, 2026',
        status: 'Processing',
        statusColor: 'bg-orange-100 text-orange-600',
        total: 1499,
        items: [
            {
                name: 'Little Explorer T-Shirt',
                price: 799,
                qty: 1,
                image: 'https://images.unsplash.com/photo-1519457431-44d59405d6e6?auto=format&fit=crop&w=200&q=80'
            },
            {
                name: 'Organic Cotton Socks (Pack of 3)',
                price: 700,
                qty: 1,
                image: 'https://images.unsplash.com/photo-1503919545874-8621bfdfafa4?auto=format&fit=crop&w=200&q=80'
            }
        ],
        shipping: {
            name: 'Dhanush J',
            address: 'Plot 123, Sunshine Apartments, MG Road, Indiranagar',
            city: 'Bangalore - 560038',
            phone: '+91 9876543210'
        },
        payment: {
            method: 'VISA •••• 4242',
            status: 'Paid'
        }
    };

    return (
        <main className="bg-[#FAF9F7] min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[800px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/profile/orders" className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm">
                        <ArrowLeft size={20} className="text-navy-900" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-navy-900 font-heading">Order #{order.id}</h1>
                        <p className="text-sm text-gray-500">Placed on {order.date}</p>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.statusColor}`}>
                            <Clock size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-navy-900">{order.status}</h3>
                            <p className="text-xs text-gray-500">Estimated Delivery: Jan 29</p>
                        </div>
                    </div>
                    {/* Progress Bar (Visual only) */}
                    <div className="hidden md:flex gap-1">
                        <div className="w-12 h-1.5 rounded-full bg-green-500" />
                        <div className="w-12 h-1.5 rounded-full bg-green-500" />
                        <div className="w-12 h-1.5 rounded-full bg-gray-200" />
                        <div className="w-12 h-1.5 rounded-full bg-gray-200" />
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                    <div className="p-4 border-b border-gray-50 font-bold text-navy-900">Items ({order.items.length})</div>
                    <div className="divide-y divide-gray-50">
                        {order.items.map((item, i) => (
                            <div key={i} className="p-4 flex gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-navy-900">{item.name}</h4>
                                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                </div>
                                <div className="font-bold text-navy-900">
                                    {formatPrice(item.price)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-between items-center">
                        <span className="font-bold text-navy-900">Total Amount</span>
                        <span className="text-xl font-bold text-navy-900">{formatPrice(order.total)}</span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Shipping */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                            <MapPin size={18} className="text-gray-400" /> Shipping Details
                        </h3>
                        <p className="font-bold text-navy-900 text-sm">{order.shipping.name}</p>
                        <p className="text-sm text-gray-500 leading-relaxed mt-1">
                            {order.shipping.address}<br />
                            {order.shipping.city}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">{order.shipping.phone}</p>
                    </div>

                    {/* Payment */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                            <CreditCard size={18} className="text-gray-400" /> Payment Info
                        </h3>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">Method</span>
                            <span className="text-sm font-bold text-navy-900">{order.payment.method}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Status</span>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">{order.payment.status}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button className="text-coral-500 font-bold text-sm hover:underline">Need Help with this Order?</button>
                </div>
            </div>
        </main>
    );
}
