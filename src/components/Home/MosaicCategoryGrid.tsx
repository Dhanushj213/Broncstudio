'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

// Real Categories from src/data/categories.ts
const MOSAIC_ITEMS = [
    {
        id: 'everyday-icons',
        label: 'Everyday Icons',
        href: '/shop/everyday-icons',
        className: 'col-span-1 row-span-1 bg-[#FDE047]', // Yellow
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
        overlayColor: 'mix-blend-multiply bg-yellow-300/20'
    },
    {
        id: 'women',
        label: 'Women',
        href: '/shop/everyday-icons/women', // Direct link to subcategory
        className: 'col-span-1 row-span-2 bg-[#FB923C]', // Orange
        image: 'https://images.unsplash.com/photo-1525845859779-54d477ff291f?w=600&q=80',
        overlayColor: ''
    },
    {
        id: 'little-legends',
        label: 'Little Legends',
        href: '/shop/little-legends',
        className: 'col-span-1 row-span-1 bg-pink-100',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
        overlayColor: ''
    },
    {
        id: 'men',
        label: 'Men',
        href: '/shop/everyday-icons/men', // Direct link to subcategory
        className: 'col-span-1 row-span-1 bg-white',
        image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80',
        overlayColor: ''
    },
    {
        id: 'pets',
        label: 'Pets',
        href: '/shop/pets',
        className: 'col-span-1 row-span-1 bg-white',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80', // Dog image from data
        overlayColor: ''
    },
    {
        id: 'style-extras',
        label: 'Accessories',
        href: '/shop/style-extras',
        className: 'col-span-2 md:col-span-1 row-span-1 bg-gray-50', // Wide on Mobile, Square on Desktop
        image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=800&q=80',
        overlayColor: ''
    },
    {
        id: 'space-stories',
        label: 'Home & Living',
        href: '/shop/space-stories',
        className: 'col-span-2 md:col-span-1 row-span-1 bg-gray-50', // Wide on Mobile, Square on Desktop
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
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
                        <img
                            src={item.image}
                            alt={item.label}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

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
