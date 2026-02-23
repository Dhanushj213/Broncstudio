'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';
import Image from 'next/image';
import Link from 'next/link';
import AmbientBackground from '@/components/UI/AmbientBackground';
import ProductCard from '@/components/Product/ProductCard';
import { Loader2, ArrowLeft } from 'lucide-react';
import { SpecialCollection } from '@/types/shop';

export default function ClientSpecialCategory({ slug }: { slug: string }) {
    const [collection, setCollection] = useState<SpecialCollection | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function fetchCollection() {
            setIsLoading(true);
            const { data: col, error } = await supabase
                .from('special_collections')
                .select('*')
                .eq('slug', slug)
                .single();

            if (col && !error) {
                setCollection(col);

                // Fetch products via junction table
                const { data: mappings } = await supabase
                    .from('special_collection_products')
                    .select('products(*)')
                    .eq('collection_id', col.id)
                    .order('sort_order', { ascending: true });

                if (mappings) {
                    const mappedProducts = mappings.map((m: any) => m.products);
                    setProducts(mappedProducts);
                }
            }
            setIsLoading(false);
        }

        if (slug) fetchCollection();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFF9F2] dark:bg-black pt-[var(--header-height)]">
                <Loader2 className="w-10 h-10 animate-spin text-coral-500" />
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9F2] dark:bg-black pt-[var(--header-height)]">
                <h1 className="text-4xl font-black text-navy-900 dark:text-white mb-4">Collection Not Found</h1>
                <Link href="/special" className="text-coral-500 hover:text-coral-600 font-bold underline">
                    Return to Special Collections
                </Link>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen flex flex-col bg-[#FFF9F2] dark:bg-black overflow-hidden">
            <AmbientBackground />

            {/* Nav Back Header */}
            <div className="fixed top-[var(--header-height)] left-0 w-full z-40 bg-[#FFF9F2]/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-4">
                <div className="container-premium max-w-[1440px] mx-auto px-6">
                    <Link href="/special" className="inline-flex items-center gap-2 text-navy-900 dark:text-white hover:text-coral-500 transition-colors font-bold uppercase text-xs tracking-widest">
                        <ArrowLeft size={16} /> Back to Hub
                    </Link>
                </div>
            </div>

            {/* Immersive Hero Header */}
            <div className="relative pt-[calc(var(--header-height)+60px)] min-h-[50vh] flex items-center justify-center -mt-[var(--header-height)]">
                {collection.banner_image ? (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={getGoogleDriveDirectLink(collection.banner_image)}
                            alt={collection.name}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                        {/* Elegant multi-stop gradient for premium feel */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#FFF9F2] dark:to-black" />
                    </div>
                ) : (
                    <div className="absolute inset-0 z-0 bg-gradient-to-b from-navy-900 to-[#FFF9F2] dark:to-black opacity-30" />
                )}

                <div className="relative z-10 container-premium max-w-[1000px] mx-auto px-6 text-center mt-20 md:mt-0">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-white shadow-sm mb-6 animate-fade-in-up">
                        Curated Selection
                    </span>
                    <h1 className="text-5xl md:text-8xl font-heading font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        {collection.name}
                    </h1>
                    {collection.description && (
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            {collection.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Product Grid Layout */}
            <div className="relative z-20 flex-1 container-premium max-w-[1440px] mx-auto px-6 py-16 md:py-24">
                <div className="flex justify-between items-end mb-12 border-b border-black/10 dark:border-white/10 pb-6">
                    <div className="text-navy-900 dark:text-white font-bold text-lg md:text-2xl">
                        {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-32 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-[32px] border border-white/20">
                        <p className="text-2xl font-bold text-navy-900 dark:text-white">This collection is currently empty.</p>
                        <p className="text-gray-500 mt-2">Check back later for new arrivals.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                {...product}
                                brand="BroncStudio" // Normalizing format for ProductCard
                                originalPrice={product.compare_at_price}
                                image={product.images?.[0] || '/images/placeholder.jpg'}
                                badge={collection.name.toUpperCase()}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
