'use client';

import React from 'react';
import ProductCard from '@/components/Product/ProductCard';
import { ShoppingBag } from 'lucide-react';

const LOOK_ITEMS = [
    { id: 'l1', name: 'Premium Canvas Sneaker', brand: 'Little Legends', price: 1299, image: 'https://images.unsplash.com/photo-1519457431-44d59405d6e6?auto=format&fit=crop&w=800&q=80' },
    { id: 'l2', name: 'Organic Cotton Tee', brand: 'Little Legends', price: 799, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80' },
    { id: 'l3', name: 'Explorer Backpack', brand: 'Everyday Icons', price: 1499, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' }
];

export default function ShopTheLook() {
    const totalPrice = LOOK_ITEMS.reduce((sum, item) => sum + item.price, 0);

    return (
        <section className="py-16 bg-gray-50/50">
            <div className="container-premium max-w-[1200px] mx-auto">
                <div className="mb-10 text-center">
                    <span className="text-coral-500 font-bold uppercase tracking-widest text-xs mb-2 block">Curated Style</span>
                    <h2 className="text-3xl font-heading font-bold text-navy-900">Shop The Complete Look</h2>
                    <p className="text-gray-500 mt-2">Handpicked essentials that look better together.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Look Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {LOOK_ITEMS.map((item, i) => (
                            <div key={item.id} className="relative">
                                {i < LOOK_ITEMS.length - ls && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-400 font-bold shadow-sm translate-x-1/2 -translate-y-1/2">+</div>
                                )}
                                <ProductCard {...item} />
                            </div>
                        ))}
                    </div>

                    {/* Bundle Action */}
                    <div className="w-full lg:w-[300px] bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
                        <h3 className="font-bold text-navy-900 mb-4">Complete Bundle</h3>
                        <div className="text-sm text-gray-500 mb-6 space-y-1">
                            {LOOK_ITEMS.map(item => (
                                <div key={item.id} className="flex justify-between w-full">
                                    <span>{item.name}</span>
                                    <span>₹{item.price}</span>
                                </div>
                            ))}
                            <div className="border-t border-gray-100 pt-2 flex justify-between w-full font-bold text-navy-900 mt-2">
                                <span>Total</span>
                                <span>₹{totalPrice}</span>
                            </div>
                        </div>
                        <button className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-coral-500 transition-colors flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl">
                            <ShoppingBag size={20} /> Add All {LOOK_ITEMS.length} to Bag
                        </button>
                        <p className="text-xs text-green-600 font-bold mt-3">You save 15% on this bundle!</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

const ls = 1; // lint fix helper
