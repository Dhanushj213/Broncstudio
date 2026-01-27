'use client';

import React from 'react';
import Link from 'next/link';

const PILLS = [
    { label: 'Review', href: '/reviews' }, // "Review" seen in screenshot? Or maybe "Trending"
    { label: 'Hoodies', href: '/shop/men-hoodies' },
    { label: 'Jackets', href: '/shop/men-jackets' },
    { label: 'Oversized T-Shirts', href: '/shop/men-oversized-tees' },
    { label: 'Joggers', href: '/shop/men-bottoms' },
    { label: 'Full Sleeve T-Shirts', href: '/shop/full-sleeve' },
];

export default function MobilePillsRail() {
    return (
        <div className="md:hidden w-full bg-white dark:bg-navy-900 py-3 border-b border-gray-100 dark:border-white/5 sticky top-[var(--header-height)] z-20">
            <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 snap-x">
                <Link
                    href="/shop/trending"
                    className="flex-shrink-0 snap-start bg-navy-900 text-white dark:bg-white dark:text-navy-900 border border-navy-900 dark:border-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide"
                >
                    Trending
                </Link>
                {PILLS.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex-shrink-0 snap-start bg-white dark:bg-navy-800 text-navy-900 dark:text-white border border-gray-200 dark:border-white/10 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap"
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
