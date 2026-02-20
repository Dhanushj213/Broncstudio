'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ProductCard from '@/components/Product/ProductCard';
import BrandLoader from '@/components/UI/BrandLoader';
import { Search, ArrowLeft } from 'lucide-react';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const router = useRouter();
    const supabase = createClient();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const performSearch = async () => {
            setLoading(true);
            if (!query.trim()) {
                setProducts([]);
                setLoading(false);
                return;
            }

            // Split query into words for better matching
            const words = query.trim().split(/\s+/).filter(Boolean);

            // Build query: name ilike %word1% AND name ilike %word2% ...
            let queryBuilder = supabase
                .from('products')
                .select('*');

            words.forEach(word => {
                queryBuilder = queryBuilder.ilike('name', `%${word}%`);
            });

            const { data, error } = await queryBuilder.limit(50);

            if (error) {
                console.error('Search error:', error);
            }

            if (data) {
                const sorted = [...data].sort((a, b) => {
                    const aSoldOut = !!a.is_sold_out || a.stock_status === 'out_of_stock';
                    const bSoldOut = !!b.is_sold_out || b.stock_status === 'out_of_stock';
                    if (aSoldOut && !bSoldOut) return 1;
                    if (!aSoldOut && bSoldOut) return -1;
                    return 0;
                });
                setProducts(sorted);
            } else {
                setProducts([]);
            }
            setLoading(false);
        };

        performSearch();
    }, [query]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pt-[var(--header-height)]">
            {/* Header */}
            <div className="sticky top-[60px] md:top-[72px] z-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 py-4 px-4 md:px-8 flex items-center gap-4 transition-all">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="text-navy-900 dark:text-white" size={24} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-navy-900 dark:text-white">
                        "{query}"
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{products.length} results found</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1400px] mx-auto p-4 md:p-8">
                {loading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <BrandLoader />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                brand="BroncStudio"
                                price={product.price}
                                originalPrice={product.compare_at_price}
                                image={product.images?.[0] || product.image_url}
                                badge={(product.is_sold_out || product.stock_status === 'out_of_stock') ? 'Sold Out' : undefined}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                        <Search size={64} className="text-coral-500 mb-4" />
                        <h2 className="text-xl font-bold text-navy-900 mb-2">No results found</h2>
                        <p className="text-gray-500">Try checking your spelling or using different keywords.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><BrandLoader /></div>}>
            <SearchContent />
        </Suspense>
    );
}
