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
        <div className="min-h-screen bg-background pt-[var(--header-height)] pb-20">
            <AmbientBackground />

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

            {/* Grid */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
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
