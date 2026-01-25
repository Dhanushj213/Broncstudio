'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Heart, MapPin, CreditCard, Headphones, ChevronRight } from 'lucide-react';

export default function QuickActions() {
    const actions = [
        { icon: Package, label: 'My Orders', color: 'text-blue-600', bg: 'bg-blue-50', href: '/profile/orders' },
        { icon: Heart, label: 'Wishlist', color: 'text-pink-600', bg: 'bg-pink-50', href: '/profile/wishlist' },
        { icon: MapPin, label: 'Addresses', color: 'text-orange-600', bg: 'bg-orange-50', href: '/profile/addresses' },
        { icon: CreditCard, label: 'Payments', color: 'text-green-600', bg: 'bg-green-50', href: '/profile/payments' },
        { icon: Headphones, label: 'Support', color: 'text-purple-600', bg: 'bg-purple-50', href: '/profile/support' },
    ];

    return (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 my-6">
            {actions.map((action, i) => (
                <Link key={i} href={action.href} className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon size={20} strokeWidth={2} />
                    </div>
                    <span className="text-xs font-bold text-navy-900 text-center">{action.label}</span>
                </Link>
            ))}
        </div>
    );
}
