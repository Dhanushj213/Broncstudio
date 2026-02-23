'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import ProductCard from '@/components/Product/ProductCard';
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
        <section className="relative pt-8 pb-4 overflow-hidden bg-gradient-to-b from-transparent to-[#F8F5F2] dark:to-black/40">
            <div className="container-premium max-w-[1440px] mx-auto px-4 md:px-6 mb-6 md:mb-8 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl md:text-5xl font-heading font-black text-navy-900 dark:text-white leading-tight">
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
            <div className="flex overflow-x-auto pb-8 pt-2 px-4 md:px-12 gap-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {products.map((product, idx) => (
                    <div key={`${product.id}-${idx}`} className="snap-start shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px]">
                        <ProductCard
                            key={product.id}
                            {...product}
                            brand="BroncStudio"
                            originalPrice={product.compare_at_price}
                            image={product.images?.[0] || '/images/placeholder.jpg'}
                            badge={product.special_badge}
                        />
                    </div>
                ))}

                {/* View All Card at the end */}
                <div className="snap-start shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] flex items-center justify-center p-0 md:p-6">
                    <Link href="/special" className="group flex flex-col items-center justify-center w-full h-[80%] min-h-[220px] rounded-[24px] md:rounded-[32px] border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-coral-500 dark:hover:border-coral-500 transition-colors bg-white/50 dark:bg-white/5 backdrop-blur-sm">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-coral-50 dark:group-hover:bg-coral-500/20 transition-all mb-3 md:mb-4 shadow-sm">
                            <ArrowRight size={20} className="text-navy-900 dark:text-white group-hover:text-coral-500 transition-colors" />
                        </div>
                        <span className="font-bold text-[10px] md:text-sm uppercase tracking-widest text-navy-900 dark:text-white group-hover:text-coral-500 transition-colors">
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
