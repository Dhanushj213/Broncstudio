'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';
import MagneticButton from '@/components/UI/MagneticButton';

export default function SpecialCollectionsRail() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function fetchSpecialProducts() {
            // First get the active collections
            const { data: collections } = await supabase
                .from('special_collections')
                .select('id, name, slug')
                .eq('is_active', true);

            if (!collections || collections.length === 0) {
                setIsLoading(false);
                return;
            }

            const collectionMap: Record<string, any> = collections.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});

            // Fetch products mapped to these collections
            const { data: mappings } = await supabase
                .from('special_collection_products')
                .select('collection_id, product_id, products(*)')
                .in('collection_id', Object.keys(collectionMap))
                .order('created_at', { ascending: false })
                .limit(8);

            if (mappings) {
                // Map the results back to a usable product format with the badge attached
                const formatted = mappings.map((m: any) => {
                    const product = m.products;
                    const coll = collectionMap[m.collection_id];
                    return {
                        ...product,
                        special_badge: coll.name,
                        special_slug: coll.slug
                    };
                });

                // Remove duplicates if a product is in multiple collections (keep first)
                const uniqueIds = new Set();
                const uniqueProducts = formatted.filter(p => {
                    if (uniqueIds.has(p.id)) return false;
                    uniqueIds.add(p.id);
                    return true;
                });

                setProducts(uniqueProducts);
            }
            setIsLoading(false);
        }

        fetchSpecialProducts();
    }, []);

    if (isLoading || products.length === 0) return null;

    return (
        <section className="relative pt-16 pb-4 overflow-hidden bg-gradient-to-b from-transparent to-[#F8F5F2] dark:to-black/40">
            <div className="container-premium max-w-[1440px] mx-auto px-6 mb-8 flex items-end justify-between">
                <div>
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-navy-900 dark:text-white leading-tight">
                        Special <span className="text-coral-500 italic font-serif font-medium">Collections</span>
                    </h2>
                </div>

                <MagneticButton strength={20} className="hidden md:block">
                    <Link href="/special" className="group flex items-center gap-3 bg-white dark:bg-navy-900 px-6 py-3 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                        <span className="font-bold text-sm uppercase tracking-wider text-navy-900 dark:text-white group-hover:text-coral-500 transition-colors">
                            View All Sets
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-navy-800 flex items-center justify-center group-hover:bg-coral-50 dark:group-hover:bg-coral-500/10 transition-colors">
                            <ArrowRight size={16} className="text-navy-900 dark:text-white group-hover:text-coral-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </Link>
                </MagneticButton>
            </div>

            {/* Horizontally Scrollable Rail */}
            <div className="flex overflow-x-auto pb-12 pt-4 px-6 md:px-12 gap-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {products.map((product, idx) => (
                    <div key={`${product.id}-${idx}`} className="snap-start shrink-0 w-[280px] md:w-[320px] relative">
                        {/* Glassmorphism Badge (Absolute to wrapper, detached from Product Link) */}
                        <div className="absolute top-4 left-4 z-20">
                            <Link href={`/special/${product.special_slug}`} onClick={(e) => e.stopPropagation()}>
                                <div className="px-4 py-1.5 rounded-full bg-white/70 dark:bg-black/60 backdrop-blur-md border border-white/40 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-navy-900 dark:text-white shadow-sm hover:scale-105 transition-transform">
                                    {product.special_badge}
                                </div>
                            </Link>
                        </div>

                        <Link href={`/product/${product.slug}`} className="block group">
                            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4 shadow-sm border border-black/5 dark:border-white/5">
                                <Image
                                    src={getGoogleDriveDirectLink(product.images?.[0] || '/images/placeholder.jpg')}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 280px, 320px"
                                />
                                {/* Liquid Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </div>

                            <div className="px-2">
                                <h3 className="font-bold text-lg text-navy-900 dark:text-white truncate mb-1 group-hover:text-coral-500 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-gray-500 font-medium">₹{product.price}</p>
                            </div>
                        </Link>
                    </div>
                ))}

                {/* View All Card at the end */}
                <div className="snap-start shrink-0 w-[280px] md:w-[320px] flex items-center justify-center p-6">
                    <Link href="/special" className="group flex flex-col items-center justify-center w-full h-[80%] rounded-[32px] border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-coral-500 dark:hover:border-coral-500 transition-colors bg-white/50 dark:bg-white/5 backdrop-blur-sm">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-coral-50 dark:group-hover:bg-coral-500/20 transition-all mb-4 shadow-sm">
                            <ArrowRight size={24} className="text-navy-900 dark:text-white group-hover:text-coral-500 transition-colors" />
                        </div>
                        <span className="font-bold uppercase tracking-widest text-navy-900 dark:text-white group-hover:text-coral-500 transition-colors">
                            Explore All
                        </span>
                    </Link>
                </div>
            </div>

            <div className="md:hidden px-6 mt-4 flex justify-center">
                <Link href="/special" className="inline-flex items-center gap-2 bg-navy-900 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider w-full justify-center shadow-lg hover:shadow-xl transition-shadow border border-white/10">
                    View All Collections <ArrowRight size={16} />
                </Link>
            </div>
        </section>
    );
}
