'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Heart, CreditCard, Headphones, ChevronRight, Wallet } from 'lucide-react';

export default function QuickActions() {
    const actions = [
        { icon: Package, label: 'My Orders', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', href: '/profile/orders' },
        { icon: Heart, label: 'Wishlist', color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/20', href: '/profile/wishlist' },

        { icon: Wallet, label: 'My Wallet', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', href: '/profile/wallet' },
        { icon: CreditCard, label: 'Payments', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', href: '/profile/payments' },
        { icon: Headphones, label: 'Support', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', href: '/profile/support' },
    ];

    return (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 my-6">
            {actions.map((action, i) => (
                <Link key={i} href={action.href} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl hover:shadow-md hover:bg-gray-50 dark:hover:bg-white/10 transition-all group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon size={20} strokeWidth={2} />
                    </div>
                    <span className="text-xs font-bold text-navy-900 dark:text-white text-center">{action.label}</span>
                </Link>
            ))}
        </div>
    );
}
