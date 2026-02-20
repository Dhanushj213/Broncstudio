'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import ProductCard from '@/components/Product/ProductCard';

export default function WishlistPage() {
    const { formatPrice } = useUI();

    // Mock Wishlist
    const products = [
        {
            id: '1',
            name: 'Little Explorer T-Shirt',
            price: 799,
            image: '',
            badge: 'New'
        },
        {
            id: '2',
            name: 'Premium Canvas Sneaker',
            price: 1299,
            originalPrice: 1599,
            image: ''
        }
    ];

    return (
        <main className="bg-[#FAF9F7] dark:bg-black min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[1000px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="p-2 rounded-full bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors shadow-sm">
                        <ArrowLeft size={20} className="text-navy-900 dark:text-white" />
                    </Link>
                    <h1 className="text-2xl font-bold text-navy-900 dark:text-white font-heading">Wishlist ({products.length})</h1>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {products.map((p, i) => (
                        <ProductCard key={i} {...p} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center text-gray-400 mb-4">
                            <Heart size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Explore our worlds and find something you love.</p>
                        <Link href="/" className="bg-navy-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold shadow-lg hover:bg-coral-500 dark:hover:bg-gray-200 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
