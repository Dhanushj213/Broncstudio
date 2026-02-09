'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import ProductCard from '@/components/Product/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DiscoverMore() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);

            // Fetch a larger batch of products to shuffle
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .limit(50); // Reasonable limit for performance

            if (error) {
                console.error('DiscoverMore Fetch Error:', error);
                setLoading(false);
                return;
            }

            if (data) {
                // Shuffle logic
                const shuffled = [...data].sort(() => Math.random() - 0.5);

                setProducts(shuffled.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    brand: 'BroncStudio',
                    price: p.price,
                    originalPrice: p.compare_at_price,
                    image: p.images?.[0] || '/images/placeholder.jpg',
                    secondaryImage: p.images?.[1],
                    badge: p.stock_status === 'out_of_stock' ? 'Sold Out' : undefined
                })));
            }
            setLoading(false);
        };

        fetchAllProducts();
    }, []);

    if (!loading && products.length === 0) return null;

    return (
        <section className="pt-10 pb-20 px-6 bg-white dark:bg-black/5">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col items-center mb-12 text-center">
                    <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                        <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse" />
                        <Sparkles size={32} className="relative z-10 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-black text-navy-900 dark:text-white mb-3">
                        Discover More
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">
                        Continue surfing through our entire collection. You might find something unexpected.
                    </p>
                </div>

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

                <div className="mt-16 text-center">
                    <Link href="/shop/all" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white/90 transition-transform hover:scale-105 shadow-lg group">
                        View all collections
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
