'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import ProductCard from '@/components/Product/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DiscoverMore({ initialData }: { initialData?: any[] }) {
    const [products, setProducts] = useState<any[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState(false);
    const supabase = createClient();

    const fetchAllProducts = async () => {
        if (initialData && products.length > 0) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(false);

        try {
            const fetchPromise = supabase
                .from('products')
                .select('*')
                .limit(50);

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Fetch timeout')), 60000)
            );

            const { data, error: fetchError } = await Promise.race([fetchPromise, timeoutPromise]) as any;

            if (fetchError) {
                console.group('DiscoverMore Fetch Error');
                console.error('Error Object:', fetchError);
                console.error('Error Message:', fetchError.message || 'No message');
                console.error('Error Code:', fetchError.code || 'No code');
                console.groupEnd();

                setError(true);
                setProducts([]);
            } else if (data) {
                const shuffled = [...data].sort(() => Math.random() - 0.5);
                setProducts(shuffled.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    brand: 'BroncStudio',
                    price: p.price,
                    originalPrice: p.compare_at_price,
                    image: p.images?.[0] || '/images/placeholder.jpg',
                    images: p.images || [],
                    badge: p.stock_status === 'out_of_stock' ? 'Sold Out' : undefined
                })));
            }
        } catch (err) {
            console.error('Unexpected error in DiscoverMore:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    if (!loading && products.length === 0) return null;

    return (
        <section className="pt-10 pb-20 px-6 bg-transparent dark:bg-black/5">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col items-center mb-12 text-center">
                    <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                        <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse" />
                        <Sparkles size={32} className="relative z-10 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-black text-navy-900 dark:text-white mb-3">
                        Discover More
                    </h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-gray-200 dark:bg-white/10 rounded-lg mb-4" />
                                <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/10 rounded mb-2" />
                                <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/10 rounded" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-[32px] border border-white/10">
                        <p className="text-gray-500 mb-6">We couldn't load more products right now.</p>
                        <button
                            onClick={() => fetchAllProducts()}
                            className="inline-flex items-center gap-2 bg-navy-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-transform hover:scale-105 shadow-md"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                        {products.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05, duration: 0.5 }}
                            >
                                <ProductCard {...product} />
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link href="/shop/all" className="inline-flex items-center gap-2 bg-white text-black px-12 py-4 rounded-[18px] font-bold uppercase tracking-widest hover:bg-white/90 transition-transform hover:scale-105 shadow-[0_10px_25px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.8)] group">
                        View all collections
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
