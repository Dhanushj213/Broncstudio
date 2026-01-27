'use client';

import React from 'react';
import Link from 'next/link';

// Expanded "Premium" Category List
const PREMIUM_CATEGORIES = [
    {
        label: 'THE SHIRT EDIT',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80',
        href: '/shop/shirts'
    },
    {
        label: 'TEE CULTURE',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
        href: '/shop/t-shirts'
    },
    {
        label: 'DENIM LAB',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', // Denim
        href: '/shop/jeans'
    },
    {
        label: 'WINTER LUXE',
        image: 'https://images.unsplash.com/photo-1548126032-079a0fb0099f?w=500&q=80',
        href: '/shop/winter'
    },
    {
        label: 'URBAN JACKETS',
        image: 'https://images.unsplash.com/photo-1551028919-ac7675cf3856?w=500&q=80',
        href: '/shop/jackets'
    },
    {
        label: 'ATHLEISURE',
        image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&q=80', // Joggers
        href: '/shop/joggers'
    },
    {
        label: 'LITTLE LEGENDS',
        image: 'https://images.unsplash.com/photo-1519238263496-6361937a4ce6?w=500&q=80',
        href: '/shop/little-legends'
    },
    {
        label: 'ACCESSORY VAULT',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80',
        href: '/shop/accessories'
    }
];

export default function MobileCategoriesGrid() {
    return (
        <section className="md:hidden py-6 bg-gray-50 dark:bg-white/5">
            <div className="px-4 mb-4">
                <h2 className="text-xl font-heading font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                    SHOP BY CATEGORY
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Curated collections for every style.</p>
            </div>

            <div className="overflow-x-auto no-scrollbar snap-x w-full scroll-pl-4">
                <div
                    className="grid grid-rows-2 grid-flow-col gap-3 w-max min-w-full"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                >
                    {PREMIUM_CATEGORIES.map((item, idx) => (
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
