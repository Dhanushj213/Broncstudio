'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORY_TAXONOMY } from '@/data/categories';

// Helper to get image info.
// We prioritize specific overrides or fall back to taxonomy images.
const getCategoryData = (key: string) => {
    const tax = (CATEGORY_TAXONOMY as any)[key];
    if (!tax) return null;
    return {
        label: tax.name,
        href: `/shop/${tax.slug}`,
        // Use the taxonomy image, or a default if missing
        img: tax.image || '/images/placeholder.jpg',
    };
};

const RAIL_ITEMS = [
    { key: 'little-legends', labelOverride: 'Kids' },
    { key: 'everyday-icons', labelOverride: 'Fashion' },
    { key: 'little-luxuries', labelOverride: 'Gifting' },
    { key: 'space-stories', labelOverride: 'Home' },
    { key: 'style-extras', labelOverride: 'Accessory' },
    { key: 'pawfect-picks', labelOverride: 'Pets' },
];

export default function MobileCategoryRail() {
    return (
        <div className="md:hidden w-full bg-white dark:bg-navy-900 pt-5 pb-4">
            <div className="overflow-x-auto no-scrollbar snap-x w-full">
                <div className="flex gap-4 w-max">
                    {/* Start Spacer */}
                    <div className="w-1 flex-shrink-0" />

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

                    {RAIL_ITEMS.map((item) => {
                        const data = getCategoryData(item.key);
                        if (!data) return null;

                        return (
                            <Link key={item.key} href={data.href} className="flex flex-col items-center gap-2 min-w-[80px] snap-start group">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shadow-md transition-transform group-active:scale-95 relative">
                                    <img
                                        src={data.img}
                                        alt={item.labelOverride || data.label}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Subtle inner border for definition */}
                                    <div className="absolute inset-0 rounded-2xl border border-black/5 dark:border-white/10 pointer-events-none"></div>
                                </div>
                                <span className="text-xs font-medium text-navy-900 dark:text-white text-center leading-tight">
                                    {item.labelOverride || data.label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* End Spacer */}
                    <div className="w-1 flex-shrink-0" />
                </div>
            </div>
        </div>
    );
}
