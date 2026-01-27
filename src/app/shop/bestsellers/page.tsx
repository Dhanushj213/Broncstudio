'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ProductCard from '@/components/Product/ProductCard';
import BrandLoader from '@/components/UI/BrandLoader';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function BestsellersPage() {
    const router = useRouter();
    const supabase = createClient();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestsellers = async () => {
            setLoading(true);

            // Fetch random products to simulate "Popular" (since no sales data)
            // Ideally we would order by 'sales_count' desc
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .limit(50);

            if (error) {
                console.error('Error fetching bestsellers:', error);
            }

            // Manual shuffle to make it look curated/randomized
            const shuffled = data ? data.sort(() => 0.5 - Math.random()) : [];

            setProducts(shuffled);
            setLoading(false);
        };

        fetchBestsellers();
    }, []);

    if (loading) return <BrandLoader text="Rounding up the favorites..." />;

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-navy-950 pt-[var(--header-height)] pb-20 overflow-hidden">
            <AmbientBackground />
            {/* Background Blob */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 blur-3xl opacity-50 pointer-events-none" />

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
                            Bestsellers
                            <TrendingUp size={18} className="text-amber-500" />
                        </h1>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Our most loved pieces</p>
                    </div>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 text-center">
                <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-md">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 dark:text-amber-400">
                        Top Rated
                    </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-heading font-black text-navy-900 dark:text-white mb-4">
                    Crowd Favorites.
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                    The pieces everyone’s talking about. Don’t miss out.
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
                                badge={idx < 5 ? 'Hot' : undefined}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
