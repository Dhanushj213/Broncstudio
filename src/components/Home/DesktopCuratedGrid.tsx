'use client';

// Vercel Rebuild Trigger: 160px micro update (Forced)
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ArrowRight } from 'lucide-react';

interface CuratedSection {
    id: string;
    title: string;
    description: string;
    image_url: string;
    category_slugs?: string[];
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

                <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar -mx-6 px-6">
                    {sections.map((item) => (
                        <Link
                            key={item.id}
                            href={`/shop/${item.category_slugs?.[0] || 'all'}?curated=${item.id}`}
                            className="group relative min-w-[220px] md:min-w-[calc(33.33%-16px)] lg:min-w-[calc(25%-18px)] aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer snap-start shrink-0 shadow-sm hover:shadow-xl transition-all"
                        >
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                <h3 className="text-white font-heading font-bold text-xl md:text-2xl uppercase tracking-widest mb-2 transform transition-transform duration-500">
                                    {item.title}
                                </h3>
                                <div className="h-1 w-12 bg-coral-500 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                                <p className="text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 delay-150 line-clamp-2">
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
