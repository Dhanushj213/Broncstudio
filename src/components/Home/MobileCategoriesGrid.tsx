'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Strictly mapped to 'src/data/categories.ts' output
const CATALOG_CATEGORIES = [
    {
        label: "Men's Edit",
        slug: 'men',
        image: '',
        href: '/collections/men'
    },
    {
        label: "Women's Edit",
        slug: 'women',
        image: '',
        href: '/collections/women'
    },
    {
        label: "Little Legends",
        slug: 'little-legends',
        image: '',
        href: '/collections/little-legends'
    },
    {
        label: "Home & Living",
        slug: 'space-stories',
        image: '',
        href: '/collections/space-stories'
    },
    {
        label: "Accessories",
        slug: 'style-extras',
        image: '',
        href: '/collections/style-extras'
    },
    {
        label: "Everyday Icons",
        slug: 'everyday-icons',
        image: '',
        href: '/collections/everyday-icons'
    },
    {
        label: "Gift Suite",
        slug: 'little-luxuries',
        image: '',
        href: '/collections/little-luxuries'
    },
    {
        label: "Pawfect Picks",
        slug: 'pets',
        image: '',
        href: '/collections/pets'
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
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.label}
                                        fill
                                        sizes="50vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gray-200" />
                                )}
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
