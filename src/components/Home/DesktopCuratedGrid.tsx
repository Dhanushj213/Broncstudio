'use client';

// Vercel Rebuild Trigger: 160px micro update (Forced)
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ArrowRight } from 'lucide-react';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((item) => (
                        <Link
                            key={item.id}
                            href={`/shop/${item.category_slugs?.[0] || 'all'}?curated=${item.id}`}
                            className="group relative w-full aspect-square overflow-hidden rounded-[32px] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
                        >
                            <img
                                src={getGoogleDriveDirectLink(item.image_url)}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />

                            {/* Centered Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                <h3 className="text-white font-serif text-3xl md:text-4xl italic mb-3 transform group-hover:scale-105 transition-transform duration-500 drop-shadow-lg">
                                    {item.title}
                                </h3>
                                <p className="text-white/90 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase drop-shadow-md">
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
