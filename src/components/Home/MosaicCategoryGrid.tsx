'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

// Real Categories from src/data/categories.ts
const MOSAIC_ITEMS = [
    {
        id: 'everyday-icons',
        label: 'Everyday Icons',
        href: '/shop/everyday-icons',
        className: 'col-span-1 row-span-1 bg-[#FDE047]', // Yellow
        image: '',
        overlayColor: 'mix-blend-multiply bg-yellow-300/20'
    },
    {
        id: 'women',
        label: 'Women',
        href: '/shop/everyday-icons/women', // Direct link to subcategory
        className: 'col-span-1 row-span-2 bg-[#FB923C]', // Orange
        image: '',
        overlayColor: ''
    },
    {
        id: 'little-legends',
        label: 'Little Legends',
        href: '/shop/little-legends',
        className: 'col-span-1 row-span-1 bg-pink-100',
        image: '',
        overlayColor: ''
    },
    {
        id: 'men',
        label: 'Men',
        href: '/shop/everyday-icons/men', // Direct link to subcategory
        className: 'col-span-1 row-span-1 bg-white',
        image: '',
        overlayColor: ''
    },
    {
        id: 'pets',
        label: 'Pets',
        href: '/shop/pets',
        className: 'col-span-1 row-span-1 bg-white',
        image: '', // Dog image from data
        overlayColor: ''
    },
    {
        id: 'style-extras',
        label: 'Accessories',
        href: '/shop/style-extras',
        className: 'col-span-2 md:col-span-1 row-span-1 bg-gray-50', // Wide on Mobile, Square on Desktop
        image: '',
        overlayColor: ''
    },
    {
        id: 'space-stories',
        label: 'Home & Living',
        href: '/shop/space-stories',
        className: 'col-span-2 md:col-span-1 row-span-1 bg-gray-50', // Wide on Mobile, Square on Desktop
        image: '',
        overlayColor: ''
    }
];

export default function MosaicCategoryGrid() {
    return (
        <section className="py-4 md:py-8 px-3 md:px-6 bg-white dark:bg-black/5">
            <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 auto-rows-[200px] md:auto-rows-[300px] grid-flow-dense">
                {MOSAIC_ITEMS.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={clsx(
                            "relative rounded-xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500",
                            item.className
                        )}
                    >
                        {/* Background Image */}
                        {item.image ? (
                            <Image
                                src={item.image}
                                alt={item.label}
                                fill
                                sizes="(max-width: 768px) 100vw, 25vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gray-100 dark:bg-white/5" />
                        )}

                        {/* Specific Overlay Adjustments for text readability if needed */}
                        <div className={`absolute inset-0 bg-black/5 ${item.overlayColor || ''} group-hover:bg-black/0 transition-colors`} />

                        {/* Floating Centered Button */}
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <span className="bg-white/95 backdrop-blur-sm text-navy-900 border border-white px-6 py-2.5 md:px-8 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg transform transition-transform duration-300 group-hover:scale-105 group-hover:bg-navy-900 group-hover:text-white group-hover:border-navy-900 whitespace-nowrap">
                                {item.label}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
