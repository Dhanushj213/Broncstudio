'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ProductCard from '@/components/Product/ProductCard';
import BrandLoader from '@/components/UI/BrandLoader';
import { Search, ArrowLeft } from 'lucide-react';

export default function SearchPage() {
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

            // Simple text search on name or description
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .ilike('name', `%${query}%`)
                .limit(50);

            if (error) {
                console.error('Search error:', error);
            }

            setProducts(data || []);
            setLoading(false);
        };

        performSearch();
    }, [query]);

    return (
        <div className="min-h-screen bg-gray-50 pt-[var(--header-height)]">
            {/* Header */}
            <div className="sticky top-[72px] z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 md:px-8 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="text-navy-900" size={24} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-navy-900">
                        "{query}"
                    </h1>
                    <p className="text-xs text-gray-500">{products.length} results found</p>
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
