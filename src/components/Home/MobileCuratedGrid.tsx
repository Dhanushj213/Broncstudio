'use client';

import React from 'react';
import Link from 'next/link';

import { CURATED_CONFIG, CURATED_GRID_ORDER } from '@/data/curatedConfig';

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
                {CURATED_GRID_ORDER.map((slug) => {
                    const item = CURATED_CONFIG[slug];
                    return (
                        <Link key={item.id} href={`/curated/${item.id}`} className="relative aspect-[3/4] group overflow-hidden rounded-lg">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex items-end justify-center">
                                <span className="text-white font-bold text-xs tracking-widest uppercase text-shadow text-center">
                                    {item.title}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    );
}
