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
        <div className="md:hidden w-full bg-white dark:bg-navy-900 pt-4 pb-2">
            <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 snap-x">
                {/* Special 'New' Item */}
                <Link href="/shop/new-arrivals" className="flex flex-col items-center gap-2 min-w-[70px] snap-start">
                    <div className="w-[70px] h-[70px] rounded-full p-[2px] bg-gradient-to-tr from-coral-500 to-yellow-500">
                        <div className="w-full h-full rounded-full border-2 border-white dark:border-navy-900 overflow-hidden bg-gray-100">
                            {/* Placeholder for 'New' - using a generic fashion image or just a color */}
                            <div className="w-full h-full bg-navy-900 flex items-center justify-center text-white text-[10px] font-bold">
                                NEW
                            </div>
                        </div>
                    </div>
                    <span className="text-[11px] font-medium text-navy-900 dark:text-white text-center leading-tight">
                        New In
                    </span>
                </Link>

                {RAIL_ITEMS.map((item) => {
                    const data = getCategoryData(item.key);
                    if (!data) return null;

                    return (
                        <Link key={item.key} href={data.href} className="flex flex-col items-center gap-2 min-w-[70px] snap-start">
                            <div className="w-[70px] h-[70px] rounded-full overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm">
                                <img
                                    src={data.img}
                                    alt={item.labelOverride || data.label}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-[11px] font-medium text-navy-900 dark:text-white text-center leading-tight">
                                {item.labelOverride || data.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
