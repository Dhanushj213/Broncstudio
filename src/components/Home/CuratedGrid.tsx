'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface CuratedSection {
    id: string;
    title: string;
    description: string;
    image_url: string;
    category_slugs?: string[];
}

export default function CuratedGrid() {
    const [sections, setSections] = useState<CuratedSection[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchSections = async () => {
            const { data } = await supabase
                .from('curated_sections')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (data) setSections(data);
        };
        fetchSections();
    }, []);

    if (sections.length === 0) return null;

    return (
        <section className="pt-12 md:pt-20 pb-0 md:pb-0 px-4 md:px-8 bg-white dark:bg-black/5">
            <div className="max-w-[1440px] mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy-900 dark:text-white uppercase tracking-widest">
                        Curated For You
                    </h2>
                    <div className="h-1 w-16 bg-coral-500 mx-auto mt-4 rounded-full" />
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 md:gap-6 no-scrollbar">
                    {sections.map((item) => (
                        <Link
                            key={item.id}
                            href={`/collections/${item.id}`}
                            className="group relative flex-shrink-0 w-[45vw] md:w-[320px] snap-start aspect-[4/5] overflow-hidden rounded-[20px] md:rounded-[32px] shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            {/* Image with Zoom Effect */}
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            {/* Floating Glass Card at Bottom */}
                            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-2xl p-4 md:p-5 text-center transform transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-white/95 dark:group-hover:bg-black/80 shadow-lg">
                                <h3 className="text-navy-900 dark:text-white font-serif text-xl md:text-2xl italic mb-1 md:mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-navy-700 dark:text-gray-300 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                    {item.description || "New Collection"}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
