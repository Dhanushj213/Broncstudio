'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 14 Specific items requested by User
const RAIL_ITEMS = [
    { label: 'Men', href: '/collections/men', img: '' },
    { label: 'Women', href: '/collections/women', img: '' },
    { label: 'Kids', href: '/collections/kids-clothing', img: '' },
    { label: 'Accessories', href: '/collections/style-extras', img: '' },
    { label: 'Books', href: '/collections/kids-books', img: '' },
    { label: 'Pets', href: '/collections/pets', img: '' },
    { label: 'Stationery', href: '/collections/stationery', img: '' },
    { label: 'Toys', href: '/collections/toys-activities', img: '' },
    { label: 'Drinkware', href: '/collections/drinkware', img: '' },
    { label: 'Lifestyle', href: '/shop/lifestyle', img: '' },
    { label: 'Desk', href: '/collections/desk-essentials', img: '' },
    { label: 'Decor', href: '/collections/home-decor', img: '' },
    { label: 'Magnets', href: '/collections/magnets', img: '' },
    { label: 'Posters', href: '/collections/posters', img: '' },
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
                                    <span className="block text-white dark:text-slate-900 text-[10px] font-bold tracking-widest uppercase mb-0.5">NEW</span>
                                    <span className="block text-white dark:text-slate-900 text-xs font-black tracking-tighter">DROPS</span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-navy-900 dark:text-white text-center tracking-wide">
                                New In
                            </span>
                        </Link>

                        {RAIL_ITEMS.map((item) => (
                            <Link key={item.label} href={item.href} className="flex flex-col items-center gap-2 min-w-[80px] snap-start group">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shadow-md transition-transform group-active:scale-95 relative">
                                    {item.img ? (
                                        <Image
                                            src={item.img}
                                            alt={item.label}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-navy-900/5 flex items-center justify-center text-xs text-navy-900/20 font-bold">
                                            {item.label[0]}
                                        </div>
                                    )}
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
