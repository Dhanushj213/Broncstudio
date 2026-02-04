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
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white dark:from-navy-900 dark:to-navy-950">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col items-center mb-12 text-center">
                    <div className="w-12 h-12 bg-coral-100 dark:bg-coral-900/20 rounded-full flex items-center justify-center text-coral-500 mb-4 animate-pulse">
                        <Sparkles size={24} />
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
                    <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-navy-900 dark:bg-white text-white dark:text-navy-900 rounded-full font-bold hover:bg-coral-500 hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 uppercase tracking-widest text-sm group">
                        View All Collections
                        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
