'use client';

import React from 'react';
import ProductCard, { ProductCardSkeleton } from '@/components/Product/ProductCard';
import { motion } from 'framer-motion';

interface MasonryProductGridProps {
    products: any[];
    title?: string;
    subtitle?: string;
    loading?: boolean;
}

export default function MasonryProductGrid({
    products,
    title = "Featured Collection",
    subtitle = "Our most loved pieces.",
    loading = false
}: MasonryProductGridProps) {
    if (loading) {
        return (
            <section className="pt-8 pb-16 md:pt-12 md:pb-24 px-4 bg-transparent dark:bg-black">
                <div className="container-premium max-w-[1440px] mx-auto">
                    <div className="text-center mb-12">
                        <div className="h-10 w-64 bg-gray-200 dark:bg-white/10 mx-auto rounded mb-4 animate-pulse" />
                        <div className="h-6 w-96 bg-gray-200 dark:bg-white/10 mx-auto rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!products || products.length === 0) return null;

    return (
        <section className="pt-8 pb-16 md:pt-12 md:pb-24 px-4 bg-transparent dark:bg-black">
            <div className="container-premium max-w-[1440px] mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-navy-900 dark:text-white mb-4">
                        {title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        {subtitle}
                    </p>
                </div>

                {/* CSS Columns Masonry */}
                {/* Standard Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.05 * (idx % 4) }}
                            className="h-full"
                        >
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                brand="BroncStudio"
                                price={product.price}
                                originalPrice={product.originalPrice || product.compare_at_price}
                                image={product.image || product.images?.[0] || '/images/placeholder.jpg'}
                                images={product.images || []}
                                badge={product.badge}
                                metadata={product.metadata}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
