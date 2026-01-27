'use client';

import React from 'react';
import Link from 'next/link';

const CURATED_ITEMS = [
    {
        id: 1,
        title: 'OLD MONEY',
        image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80',
        href: '/shop/old-money'
    },
    {
        id: 2,
        title: 'OFFICE EDIT',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&q=80',
        href: '/shop/office-edit'
    },
    {
        id: 3,
        title: 'CONCERT FITS',
        image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65dcef?w=500&q=80',
        href: '/shop/concert-fits'
    },
    {
        id: 4,
        title: 'CULTURE CODE',
        image: 'https://images.unsplash.com/photo-1523396896303-8e053e8a2866?w=500&q=80',
        href: '/shop/culture-code'
    },
];

export default function MobileCuratedGrid() {
    return (
        <section className="md:hidden py-6 bg-white dark:bg-navy-900">
            <div className="px-4 mb-4">
                <h2 className="text-lg font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                    CURATED FOR YOU
                </h2>
                <div className="h-0.5 w-12 bg-coral-500 mt-1"></div>
            </div>
            <div className="grid grid-cols-2 gap-1 px-1">
                {CURATED_ITEMS.map((item) => (
                    <Link key={item.id} href={item.href} className="relative aspect-[4/5] group overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-4">
                            <span className="text-white font-bold text-sm tracking-widest uppercase text-shadow">
                                {item.title}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
