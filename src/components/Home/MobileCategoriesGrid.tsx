'use client';

import React from 'react';
import Link from 'next/link';

const CATEGORY_ITEMS = [
    {
        label: 'T-SHIRTS',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
        href: '/shop/t-shirts'
    },
    {
        label: 'WINTER EDIT',
        image: 'https://images.unsplash.com/photo-1548126032-079a0fb0099f?w=500&q=80',
        href: '/shop/winter'
    },
    {
        label: 'SHIRTS',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80',
        href: '/shop/shirts'
    },
    {
        label: 'JOGGERS',
        image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&q=80',
        href: '/shop/joggers'
    },
];

export default function MobileCategoriesGrid() {
    return (
        <section className="md:hidden py-4 bg-gray-50 dark:bg-white/5">
            <div className="px-4 mb-3">
                <h2 className="text-lg font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                    CATEGORIES
                </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 px-4">
                {CATEGORY_ITEMS.map((item, idx) => (
                    <Link key={idx} href={item.href} className="flex flex-col gap-2 group">
                        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-200">
                            <img
                                src={item.image}
                                alt={item.label}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-center text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wide">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
