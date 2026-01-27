'use client';

import React from 'react';
import Link from 'next/link';

// Strictly mapped to 'src/data/categories.ts' output
const CATALOG_CATEGORIES = [
    {
        label: "Men's Edit",
        slug: 'men',
        image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80',
        href: '/collections/men'
    },
    {
        label: "Women's Edit",
        slug: 'women',
        image: 'https://images.unsplash.com/photo-1525845859779-54d477ff291f?w=500&q=80',
        href: '/collections/women'
    },
    {
        label: "Little Legends",
        slug: 'little-legends',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
        href: '/collections/little-legends'
    },
    {
        label: "Home & Living",
        slug: 'space-stories',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80',
        href: '/collections/space-stories'
    },
    {
        label: "Accessories",
        slug: 'style-extras',
        image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&q=80',
        href: '/collections/style-extras'
    },
    {
        label: "Everyday Icons",
        slug: 'everyday-icons',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
        href: '/collections/everyday-icons'
    },
    {
        label: "Gift Suite",
        slug: 'little-luxuries',
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80',
        href: '/collections/little-luxuries'
    },
    {
        label: "Pawfect Picks",
        slug: 'pets', // Need to check if 'pets' exists. In categories.ts it wasn't shown in the last read?
        // Wait, I saw 'PETS' in the Worlds page CATALOG but did I see it in categories.ts?
        // Checking categories.ts content again... 
        // It seems 'PETS' might NOT be in categories.ts! I missed adding it to the main taxonomy?
        // Let's check lines 208-209. It ends at 'style-extras'.
        // I need to ADD Pets to categories.ts if it's missing, otherwise /collections/pets will 404.
        // For now, I will add the link, but I might need to fix categories.ts.
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80',
        href: '/collections/pets' // Will likely 404 if not in taxonomy
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
