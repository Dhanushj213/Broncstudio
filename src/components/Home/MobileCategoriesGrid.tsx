'use client';

import React from 'react';
import Link from 'next/link';

// Strictly mapped to 'src/data/categories.ts' output
const CATALOG_CATEGORIES = [
    {
        label: "KIDS & LEARNING",
        slug: 'kids-learning',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
        href: '/shop/kids-learning'
    },
    {
        label: "CLOTHING",
        slug: 'clothing',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
        href: '/shop/clothing'
    },
    {
        label: "ACCESSORIES",
        slug: 'accessories',
        image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&q=80',
        href: '/shop/accessories'
    },
    {
        label: "TECH & DESK",
        slug: 'tech-desk',
        image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=500&q=80',
        href: '/shop/tech-desk'
    },
    {
        label: "HOME & DECOR",
        slug: 'home-decor',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80',
        href: '/shop/home-decor'
    },
    {
        label: "DRINKWARE",
        slug: 'drinkware',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80',
        href: '/shop/drinkware'
    },
    {
        label: "BAGS",
        slug: 'bags',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
        href: '/shop/bags'
    },
    {
        label: "GIFTS",
        slug: 'gifts',
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80',
        href: '/shop/gifts'
    },
    {
        label: "PETS",
        slug: 'pets',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80',
        href: '/shop/pets'
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
