'use client';

import React from 'react';
import ProductCard from '@/components/Product/ProductCard';
import { motion } from 'framer-motion';

interface MasonryProductGridProps {
    products: any[];
}

export default function MasonryProductGrid({ products }: MasonryProductGridProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-16 md:py-24 px-4 bg-gray-50 dark:bg-white/5">
            <div className="container-premium max-w-[1440px] mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-navy-900 dark:text-white mb-4">
                        Featured Collection
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Our most loved pieces, curated just for you.
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
                                // Pass secondary image if available (Assuming full product object has images array)
                                secondaryImage={product.images?.[1]}
                                badge={product.badge}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
