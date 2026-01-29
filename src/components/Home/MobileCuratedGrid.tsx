'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function MobileCuratedGrid() {
    const [chunks, setChunks] = useState<any[][]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase
                .from('curated_sections')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (data && data.length > 0) {
                const chunkSize = 4;
                const newChunks = [];
                for (let i = 0; i < data.length; i += chunkSize) {
                    newChunks.push(data.slice(i, i + chunkSize));
                }
                setChunks(newChunks);
            }
        };
        fetchData();
    }, []);

    if (chunks.length === 0) return null;

    return (
        <section className="md:hidden py-6 bg-white dark:bg-navy-900 overflow-hidden">
            <div className="px-4 mb-4">
                <h2 className="text-lg font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                    CURATED FOR YOU
                </h2>
                <div className="h-0.5 w-12 bg-coral-500 mt-1"></div>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-4 pb-4">
                {chunks.map((chunk, pageIndex) => (
                    <div
                        key={pageIndex}
                        className="flex-none w-[85vw] grid grid-cols-2 gap-3 snap-center"
                    >
                        {chunk.map((item) => {
                            return (
                                <Link key={item.id} href={`/curated/${item.id}`} className="relative aspect-[3/4] group overflow-hidden rounded-lg shadow-sm">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex items-end justify-center">
                                        <span className="text-white font-bold text-xs tracking-widest uppercase text-shadow text-center leading-tight">
                                            {item.title}
                                        </span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ))}
            </div>
        </section>
    );
}
