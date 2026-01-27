'use client';

import React from 'react';
import ProductCard from '@/components/Product/ProductCard';

interface Product {
    id: string;
    name: string;
    brand?: string;
    price: number;
    originalPrice?: number;
    image: string;
    badge?: string;
}

interface ProductShowcaseProps {
    title: string;
    subtitle?: string;
    products: Product[];
    className?: string;
}

export default function ProductShowcase({ title, subtitle, products, className = "", layout = "grid" }: ProductShowcaseProps & { layout?: 'grid' | 'carousel' }) {
    return (
        <section className={`py-12 md:py-16 ${className}`}>
            <div className="container-premium max-w-[1200px] mx-auto">
                <div className="mb-8 md:mb-10 text-center md:text-left px-4 md:px-0">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy-900 dark:text-white mb-2">{title}</h2>
                    {subtitle && <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">{subtitle}</p>}
                </div>

                {layout === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-6 md:gap-x-6 md:gap-y-8 px-3 md:px-0">
                        {products.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto snap-x snap-mandatory pb-8 w-full no-scrollbar scroll-pl-4">
                        <div
                            className="flex w-max min-w-full items-stretch"
                            style={{ paddingLeft: '16px', paddingRight: '16px' }}
                        >
                            <div className="flex gap-3">
                                {products.map((product) => (
                                    <div key={product.id} className="w-[53vw] flex-shrink-0 sm:w-[40vw] md:w-auto md:min-w-[280px] snap-start">
                                        <ProductCard {...product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
