'use client';

import React from 'react';
import Link from 'next/link';

// 14 Specific items requested by User
const RAIL_ITEMS = [
    { label: 'Men', href: '/collections/men', img: 'https://images.unsplash.com/photo-1516257984-b1b4d8c92305?w=500&q=80' },
    { label: 'Women', href: '/collections/women', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80' },
    { label: 'Kids', href: '/collections/kids-clothing', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&q=80' },
    { label: 'Accessories', href: '/collections/style-extras', img: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&q=80' },
    { label: 'Books', href: '/collections/kids-books', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80' },
    { label: 'Pets', href: '/collections/pets', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80' },
    { label: 'Stationery', href: '/collections/stationery', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80' },
    { label: 'Toys', href: '/collections/toys-activities', img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&q=80' },
    { label: 'Drinkware', href: '/collections/drinkware', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80' },
    { label: 'Gifts', href: '/collections/gifts', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80' },
    { label: 'Desk', href: '/collections/desk-essentials', img: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=500&q=80' },
    { label: 'Decor', href: '/collections/home-decor', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&q=80' },
    { label: 'Magnets', href: '/collections/magnets', img: 'https://images.unsplash.com/photo-1596495370355-467332247aa6?w=500&q=80' },
    { label: 'Posters', href: '/collections/posters', img: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=500&q=80' },
];

export default function MobileCategoryRail() {
    return (
        <div className="md:hidden w-full bg-white dark:bg-navy-900 pt-5 pb-4">
            <div className="overflow-x-auto no-scrollbar snap-x w-full scroll-pl-4">
                <div
                    className="flex w-max min-w-full"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                >
                    <div className="flex gap-3">
                        {/* Special 'New' Item - Premium Solid Tile */}
                        <Link href="/shop/new-arrivals" className="flex flex-col items-center gap-2 min-w-[80px] snap-start group">
                            <div className="w-20 h-20 rounded-2xl bg-navy-900 dark:bg-white flex items-center justify-center shadow-lg shadow-navy-900/10 transition-transform group-active:scale-95">
                                <div className="text-center">
                                    <span className="block text-white dark:text-navy-900 text-[10px] font-bold tracking-widest uppercase mb-0.5">NEW</span>
                                    <span className="block text-white dark:text-navy-900 text-xs font-black tracking-tighter">DROPS</span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-navy-900 dark:text-white text-center tracking-wide">
                                New In
                            </span>
                        </Link>

                        {RAIL_ITEMS.map((item) => (
                            <Link key={item.label} href={item.href} className="flex flex-col items-center gap-2 min-w-[80px] snap-start group">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shadow-md transition-transform group-active:scale-95 relative">
                                    <img
                                        src={item.img}
                                        alt={item.label}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Subtle inner border for definition */}
                                    <div className="absolute inset-0 rounded-2xl border border-black/5 dark:border-white/10 pointer-events-none"></div>
                                </div>
                                <span className="text-xs font-medium text-navy-900 dark:text-white text-center leading-tight whitespace-nowrap">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
