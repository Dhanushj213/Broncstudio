'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';
import Link from 'next/link';
import Image from 'next/image';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { SpecialCollection } from '@/types/shop';

export default function SpecialHubPage() {
    const [collections, setCollections] = useState<(SpecialCollection & { productCount?: number })[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function fetchHub() {
            // Fetch collections
            const { data: cols } = await supabase
                .from('special_collections')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (cols && cols.length > 0) {
                // Fetch product counts
                const colIds = cols.map(c => c.id);
                const { data: counts } = await supabase
                    .from('special_collection_products')
                    .select('collection_id, product_id')
                    .in('collection_id', colIds);

                const countMap = cols.reduce((acc, c) => ({ ...acc, [c.id]: 0 }), {} as Record<string, number>);
                if (counts) {
                    counts.forEach(c => {
                        countMap[c.collection_id] = (countMap[c.collection_id] || 0) + 1;
                    });
                }

                setCollections(cols.map(c => ({ ...c, productCount: countMap[c.id] })));
            }
            setIsLoading(false);
        }

        fetchHub();
    }, []);

    return (
        <main className="relative min-h-screen pt-[var(--header-height)] pb-24 bg-[#FFF9F2] dark:bg-black overflow-hidden">
            <AmbientBackground />

            {/* Header */}
            <div className="relative z-10 container-premium max-w-[1200px] mx-auto px-6 py-12 md:py-20 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="mx-auto w-12 h-12 rounded-full border border-navy-900/10 dark:border-white/10 flex items-center justify-center mb-6 bg-white dark:bg-white/5 shadow-sm">
                        <Sparkles size={24} className="text-coral-500" />
                    </div>
                    <h1 className="text-4xl md:text-7xl font-heading font-black text-navy-900 dark:text-white leading-[1.1]">
                        The <span className="text-coral-500 italic font-serif font-medium">Special</span> Collection
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                        Curated selections of our finest pieces. Highly demanded, perfectly paired.
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="relative z-10 container-premium max-w-[1440px] mx-auto px-6">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
                    </div>
                ) : collections.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-3xl border border-white/20">
                        <p className="text-2xl font-bold text-navy-900 dark:text-white">New collections dropping soon.</p>
                        <p className="text-gray-500 mt-2">Check back later for exclusive sets.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-[400px]">
                        {collections.map((col, idx) => {
                            // Bento logic: make every 3rd item span 2 columns on large screens if possible
                            const isLarge = idx % 5 === 0 || idx % 5 === 3;

                            return (
                                <Link
                                    key={col.id}
                                    href={`/special/${col.slug}`}
                                    className={`group relative overflow-hidden rounded-[32px] block bg-gray-100 dark:bg-gray-900 border border-black/5 dark:border-white/5 transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] ${isLarge ? 'lg:col-span-2' : 'lg:col-span-1'
                                        }`}
                                >
                                    <Image
                                        src={getGoogleDriveDirectLink(col.thumbnail_image || col.banner_image || '')}
                                        alt={col.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent transition-opacity duration-500" />

                                    <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
                                                    {col.productCount || 0} ITEMS
                                                </span>
                                            </div>
                                            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-2 leading-none">
                                                {col.name}
                                            </h2>
                                            {col.description && (
                                                <p className="text-white/80 line-clamp-2 max-w-lg mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                    {col.description}
                                                </p>
                                            )}
                                            <div className="inline-flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                                Explore Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
