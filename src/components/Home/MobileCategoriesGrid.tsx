'use client';

import React from 'react';
import Link from 'next/link';

// Strictly mapped to 'src/data/categories.ts' output
const CATALOG_CATEGORIES = [
    {
        label: "LITTLE LEGENDS",
        slug: 'little-legends',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
        href: '/shop/little-legends'
    },
    {
        label: "EVERYDAY ICONS",
        slug: 'everyday-icons',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
        href: '/shop/everyday-icons'
    },
    {
        label: "LITTLE LUXURIES",
        slug: 'little-luxuries',
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80',
        href: '/shop/little-luxuries'
    },
    {
        label: "SPACE STORIES",
        slug: 'space-stories',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80',
        href: '/shop/space-stories'
    },
    {
        label: "STYLE EXTRAS",
        slug: 'style-extras',
        image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&q=80',
        href: '/shop/style-extras'
    }
];

export default function MobileCategoriesGrid() {
    return (
        <section className="md:hidden py-6 bg-gray-50 dark:bg-white/5">
            <div className="px-4 mb-4">
                <h2 className="text-xl font-heading font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                    SHOP BY CATEGORY
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Explore our curated collections.</p>
            </div>

            <div className="overflow-x-auto no-scrollbar snap-x w-full scroll-pl-4">
                <div
                    className="grid grid-rows-2 grid-flow-col gap-3 w-max min-w-full"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                >
                    {CATALOG_CATEGORIES.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            className="flex flex-col gap-2 group snap-start w-[calc(50vw-24px)]"
                        >
                            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-200 relative">
                                <img
                                    src={item.image}
                                    alt={item.label}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            </div>
                            <span className="text-center text-[10px] font-bold text-navy-900 dark:text-white uppercase tracking-widest truncate px-1">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
