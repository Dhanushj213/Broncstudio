import React from 'react';
import ProductCard from '@/components/Product/ProductCard';
import { ShoppingBag, Check, Plus } from 'lucide-react';
import Image from 'next/image';

const LOOK_ITEMS = [
    { id: 'l1', name: 'Premium Canvas Sneaker', brand: 'Little Legends', price: 1299, image: 'https://images.unsplash.com/photo-1519457431-44d59405d6e6?auto=format&fit=crop&w=800&q=80' },
    { id: 'l2', name: 'Organic Cotton Tee', brand: 'Little Legends', price: 799, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80' },
    { id: 'l3', name: 'Explorer Backpack', brand: 'Everyday Icons', price: 1499, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' }
];

export default function ShopTheLook() {
    const totalPrice = LOOK_ITEMS.reduce((sum, item) => sum + item.price, 0);

    return (
        <section className="py-12 md:py-16 bg-gray-50/50">
            <div className="container-premium max-w-[1200px] mx-auto px-4">
                <div className="mb-8 md:mb-10 text-center">
                    <span className="text-coral-500 font-bold uppercase tracking-widest text-xs mb-2 block">Curated Style</span>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy-900">Shop The Complete Look</h2>
                    <p className="text-sm md:text-base text-gray-500 mt-2">Handpicked essentials that look better together.</p>
                </div>

                {/* --- MOBILE LAYOUT (Amazon Style) --- */}
                <div className="block md:hidden bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-navy-900 mb-4 text-sm uppercase tracking-wide">Buy it with</h3>

                    {/* Image Row */}
                    <div className="flex items-center justify-between gap-1 mb-6">
                        {LOOK_ITEMS.map((item, i) => (
                            <React.Fragment key={item.id}>
                                <div className="relative flex-1 aspect-[3/4] rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 33vw"
                                    />
                                </div>
                                {i < LOOK_ITEMS.length - 1 && (
                                    <Plus size={14} className="text-gray-400 flex-shrink-0" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Price Summary */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="text-lg font-bold text-navy-900">
                            Total price: <span className="text-red-600">₹{totalPrice}</span>
                        </div>
                    </div>

                    {/* Add Button */}
                    <button className="w-full py-3 bg-navy-900 text-white font-bold rounded-xl shadow-lg hover:bg-navy-800 transition-colors flex items-center justify-center gap-2 mb-4 text-sm">
                        Add all {LOOK_ITEMS.length} to Cart
                    </button>

                    {/* Checklist */}
                    <div className="space-y-3">
                        {LOOK_ITEMS.map((item, i) => (
                            <div key={item.id} className="flex items-start gap-2 text-sm">
                                <div className="mt-0.5 w-4 h-4 rounded bg-navy-900/10 flex items-center justify-center text-navy-900">
                                    <Check size={10} strokeWidth={4} />
                                </div>
                                <div className="leading-tight">
                                    <span className="font-medium text-navy-900">{i === 0 ? 'This item:' : ''} {item.name}</span>
                                    <span className="text-gray-400 mx-1">-</span>
                                    <span className="font-bold text-red-600">₹{item.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* --- DESKTOP LAYOUT (Original) --- */}
                <div className="hidden md:flex flex-col lg:flex-row gap-8 items-start">
                    {/* Look Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {LOOK_ITEMS.map((item, i) => (
                            <div key={item.id} className="relative">
                                {i < LOOK_ITEMS.length - 1 && (
                                    <div className="absolute top-1/2 -right-3 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-400 font-bold shadow-sm translate-x-1/2 -translate-y-1/2">+</div>
                                )}
                                <ProductCard {...item} />
                            </div>
                        ))}
                    </div>

                    {/* Bundle Action */}
                    <div className="w-full lg:w-[300px] bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center sticky top-24">
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
