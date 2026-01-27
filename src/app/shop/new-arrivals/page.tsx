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

            // Fetch latest 50 products
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                console.error('Error fetching new arrivals:', error);
            }

            setProducts(data || []);
            setLoading(false);
        };

        fetchNewArrivals();
    }, []);

    if (loading) return <BrandLoader text="Unboxing new drops..." />;

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
                            New Arrivals
                            <Sparkles size={16} className="text-coral-500 animate-pulse" />
                        </h1>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Fresh drops from this week</p>
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
                                badge="New"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
