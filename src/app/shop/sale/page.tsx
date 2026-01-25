'use client';

import React from 'react';
import { useUI } from '@/context/UIContext';
import ProductCard from '@/components/Product/ProductCard';
import { Percent, ArrowRight } from 'lucide-react';
import { getProductImage } from '@/utils/sampleImages';

export default function SalePage() {
    const { formatPrice } = useUI();

    // Mock Sale Products
    const saleProducts = [
        {
            id: 'SALE-1',
            name: 'Little Explorer T-Shirt',
            brand: 'Little Legends',
            price: 799,
            originalPrice: 1299,
            image: getProductImage(1),
            badge: '40% OFF'
        },
        {
            id: 'SALE-2',
            name: 'Space Stories Bedseet',
            brand: 'Space Stories',
            price: 1899,
            originalPrice: 2499,
            image: getProductImage(2),
            badge: 'BESTSELLER'
        },
        {
            id: 'SALE-3',
            name: 'Organic Cotton Socks',
            brand: 'Everyday Icons',
            price: 499,
            originalPrice: 899,
            image: getProductImage(3),
            badge: 'STEAL DEAL'
        },
        {
            id: 'SALE-4',
            name: 'Summer Breeze Dress',
            brand: 'Little Legends',
            price: 1299,
            originalPrice: 1999,
            image: getProductImage(4),
            badge: 'Limited Time'
        },
        {
            id: 'SALE-5',
            name: 'Wooden Puzzle Set',
            brand: 'Little Legends',
            price: 899,
            originalPrice: 1499,
            image: getProductImage(5),
            badge: 'Clearance'
        },
        {
            id: 'SALE-6',
            name: 'Comfort Knit Beanie',
            brand: 'Style Extras',
            price: 399,
            originalPrice: 799,
            image: getProductImage(6),
            badge: 'Hot'
        }
    ];

    return (
        <main className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-navy-900 text-white pt-10 pb-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-coral-500 rounded-full blur-[100px] opacity-20" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-[80px] opacity-20" />

                <div className="container-premium max-w-[1200px] mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-coral-300 mb-4 border border-white/10 uppercase tracking-widest">
                        <Percent size={14} /> End of Season Sale
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                        Up to <span className="text-coral-500">60% OFF</span> on Legends
                    </h1>
                    <p className="text-gray-300 max-w-xl mx-auto mb-8 text-lg">
                        Grab your favorites before they are gone. Limited stock available on our most loved designs.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="container-premium max-w-[1200px] mx-auto px-4 md:px-6 -mt-10 pb-24 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                    {saleProducts.map((product, i) => (
                        <ProductCard key={i} {...product} />
                    ))}
                </div>

                <div className="mt-20 flex flex-col items-center justify-center bg-gray-50 rounded-3xl p-12 text-center border border-gray-100">
                    <h2 className="text-2xl font-bold text-navy-900 mb-2">Don't miss out on future sales</h2>
                    <p className="text-gray-500 mb-6 max-w-md">Join our newsletter and be the first to know about flash sales and new drops.</p>
                    <div className="flex w-full max-w-md gap-2">
                        <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-navy-900 transition-colors" />
                        <button className="bg-navy-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-coral-500 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
