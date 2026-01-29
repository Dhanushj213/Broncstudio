'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ArrowRight } from 'lucide-react';

interface CuratedSection {
    id: string;
    title: string;
    description: string;
    image_url: string;
}

export default function DesktopCuratedGrid() {
    const [sections, setSections] = useState<CuratedSection[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchSections = async () => {
            const { data } = await supabase
                .from('curated_sections')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (data) {
                setSections(data);
            }
        };
        fetchSections();
    }, []);

    if (sections.length === 0) return null;

    return (
        <section className="hidden md:block py-16 px-6 bg-white dark:bg-navy-900">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                            Curated For You
                        </h2>
                        <div className="h-1 w-20 bg-coral-500 mt-2"></div>
                    </div>

                </div>

                <div className="grid grid-cols-4 gap-6">
                    {sections.map((item) => (
                        <Link
                            key={item.id}
                            href={`/curated/${item.id}`} // Or logic to map to standard shop page if needed, but lets use /curated/[id] for now or logic from config
                            className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer"
                        >
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-white font-heading font-bold text-xl uppercase tracking-wide text-shadow mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    {item.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
