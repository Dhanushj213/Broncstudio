'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ProductCard from '@/components/Product/ProductCard';
import BrandLoader from '@/components/UI/BrandLoader';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NewArrivalsPage() {
    const router = useRouter();
    const supabase = createClient();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            setLoading(true);

            // 1. Fetch Manual "new-arrival" tag
            const { data: manualData } = await supabase
                .from('products')
                .select('*')
                .contains('metadata', { tags: ['new-arrival'] });

            // 2. Fetch latest 50 products (Automatic)
            const { data: autoData } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            // 3. Merge: Manual first, then Auto (Dedupe by ID)
            const combined = [...(manualData || []), ...(autoData || [])];
            const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

            setProducts(unique);
            setLoading(false);
        };

        fetchNewArrivals();
    }, []);

    if (loading) return <BrandLoader text="Unboxing new drops..." />;

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-navy-950 pt-[var(--header-height)] pb-20 overflow-hidden">
            <AmbientBackground />
            {/* Background Blob */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-coral-500/10 blur-3xl opacity-50 pointer-events-none" />

            {/* Header */}
            <div className="sticky top-[72px] z-30 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-navy-900 dark:text-white" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold font-heading text-navy-900 dark:text-white leading-none flex items-center gap-2">
                            New Arrivals
                            <Sparkles size={16} className="text-coral-500 animate-pulse" />
                        </h1>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Fresh drops from this week</p>
                    </div>
                </div>
            </div>

            {/* Hero Banner (Text Only for Quick Pages) */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 text-center">
                <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-coral-500/10 border border-coral-500/20 backdrop-blur-md">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-coral-500">
                        Just In
                    </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-heading font-black text-navy-900 dark:text-white mb-4">
                    Obsessed.
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                    Be the first to snag the latest styles added to our collection.
                </p>
            </div>

            {/* Grid */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                    {products.map((product, idx) => (
                        <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                brand="BroncStudio"
                                price={product.price}
                                originalPrice={product.compare_at_price}
                                image={product.images?.[0] || product.image_url || '/images/placeholder.jpg'}
                                badge="New"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
