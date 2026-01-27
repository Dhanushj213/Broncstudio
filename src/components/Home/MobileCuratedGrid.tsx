'use client';

import React from 'react';
import Link from 'next/link';

const CURATED_ITEMS = [
    {
        id: 1,
        title: 'OLD MONEY',
        image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80',
        href: '/curated/old-money'
    },
    {
        id: 2,
        title: 'OFFICE EDIT',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&q=80',
        href: '/curated/office-edit'
    },
    {
        id: 3,
        title: 'CONCERT FITS',
        image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65dcef?w=500&q=80',
        href: '/curated/concert-fits'
    },
    {
        id: 4,
        title: 'CULTURE CODE',
        image: 'https://images.unsplash.com/photo-1523396896303-8e053e8a2866?w=500&q=80',
        href: '/curated/culture-code'
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
            <div className="grid grid-cols-2 gap-3 px-4">
                {CURATED_ITEMS.map((item) => (
                    <Link key={item.id} href={item.href} className="relative aspect-[3/4] group overflow-hidden rounded-lg">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex items-end justify-center">
                            <span className="text-white font-bold text-xs tracking-widest uppercase text-shadow">
                                {item.title}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
