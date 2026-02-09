'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ProductCard from '@/components/Product/ProductCard';
import BrandLoader from '@/components/UI/BrandLoader';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { ArrowLeft, Shuffle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AllProductsPage() {
    const router = useRouter();
    const supabase = createClient();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from('products')
                .select('*');

            if (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
                return;
            }

            if (data) {
                // Fisher-Yates Shuffle
                const shuffled = [...data];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }

                // Deduplicate just in case (though DB likely enforces unique IDs)
                const unique = Array.from(new Map(shuffled.map(item => [item.id, item])).values());

                setProducts(unique);
            }
            setLoading(false);
        };

        fetchAllProducts();
    }, []);

    if (loading) return <BrandLoader text="Shuffling the collection..." />;

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-black pb-20 overflow-hidden">
            <AmbientBackground />

            {/* Header */}
            <div className="sticky top-[60px] z-30 bg-white dark:bg-black border-b border-gray-100 dark:border-white/5 py-4 px-6 md:px-12 flex items-center justify-between transition-all duration-300 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-navy-900 dark:text-white" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold font-heading text-navy-900 dark:text-white leading-none flex items-center gap-2">
                            All Collections
                            <Shuffle size={16} className="text-gray-400" />
                        </h1>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
                            {products.length} Items • Randomly Curated
                        </p>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 pt-32">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                    {products.map((product, idx) => (
                        <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(idx * 0.05, 1)}s` }}>
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                brand="BroncStudio"
                                price={product.price}
                                originalPrice={product.compare_at_price}
                                image={product.images?.[0] || product.image_url || '/images/placeholder.jpg'}
                            // No specific badge for "All" unless per product logic
                            />
                        </div>
                    ))}
                </div>

                {/* Return to Shop Button */}
                <div className="mt-20 text-center">
                    <button
                        onClick={() => router.push('/shop')}
                        className="inline-flex items-center gap-2 bg-navy-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-transform hover:scale-105 shadow-lg"
                    >
                        <ArrowLeft size={18} />
                        Back to Categories
                    </button>
                </div>
            </div>
        </div>
    );
}
