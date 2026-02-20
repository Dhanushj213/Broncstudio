'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

export default function MobileCuratedGrid() {
    const [sections, setSections] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase
                .from('curated_sections')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (data) {
                setSections(data);
            }
        };
        fetchData();
    }, []);

    if (sections.length === 0) return null;

    return (
        <section className="md:hidden py-6 bg-white dark:bg-navy-900 overflow-hidden">
            <div className="px-4 mb-4">
                <h2 className="text-lg font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                    CURATED FOR YOU
                </h2>
                <div className="h-0.5 w-12 bg-coral-500 mt-1"></div>
            </div>

            {/* Horizontal 2xGrid (2 rows, horizontal scroll) */}
            <div className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-8 px-4 pb-4 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-pl-4">
                {sections.map((item) => (
                    <Link
                        key={item.id}
                        href={`/shop/${item.category_slugs?.[0] || 'all'}?curated=${item.id}`}
                        className="flex flex-col gap-2 w-[calc(50vw-24px)] snap-start group"
                    >
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100">
                            <img
                                src={getGoogleDriveDirectLink(item.image_url)}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <span className="text-navy-900 dark:text-white font-serif uppercase tracking-widest text-[10px] text-center font-bold">
                            {item.title}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
