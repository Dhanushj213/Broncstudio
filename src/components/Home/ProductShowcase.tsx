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
    metadata?: any;
}

interface ProductShowcaseProps {
    title: string;
    subtitle?: string;
    products: Product[];
    className?: string;
    layout?: 'grid' | 'carousel';
    fullWidth?: boolean;
}

export default function ProductShowcase({
    title,
    subtitle,
    products,
    className = "",
    layout = "grid",
    fullWidth = false
}: ProductShowcaseProps) {
    const containerClasses = fullWidth
        ? "w-full"
        : "container-premium max-w-[1200px] mx-auto";

    return (
        <section className={`py-12 md:py-16 ${className}`}>
            <div className={containerClasses}>
                <div className={`mb-8 md:mb-10 text-center px-4 ${fullWidth ? 'max-w-[1200px] mx-auto' : 'md:px-0'}`}>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy-900 dark:text-white mb-2">{title}</h2>
                    {subtitle && <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">{subtitle}</p>}
                </div>

                {layout === 'grid' ? (
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-6 md:gap-x-6 md:gap-y-8 px-3 ${fullWidth ? 'md:px-8' : 'md:px-0'}`}>
                        {products.map((product) => (
                            <ProductCard key={product.id} {...product} metadata={product.metadata} />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto snap-x snap-mandatory pb-8 w-full no-scrollbar scroll-pl-4">
                        <div
                            className="flex w-max min-w-full items-stretch"
                            style={{ paddingLeft: fullWidth ? '32px' : '16px', paddingRight: fullWidth ? '32px' : '16px' }}
                        >
                            <div className="flex gap-3 md:gap-6">
                                {products.map((product) => (
                                    <div key={product.id} className="w-[65vw] flex-shrink-0 sm:w-[45vw] md:w-auto md:min-w-[320px] snap-start">
                                        <ProductCard {...product} metadata={product.metadata} />
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
