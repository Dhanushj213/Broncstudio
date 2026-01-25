'use client';

import React, { useState } from 'react';
import { Star, Truck, RotateCcw, ShieldCheck, ChevronDown, Ruler, ShoppingBag, Zap } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';

interface ProductInfoProps {
    product: any; // Using any for simplicity in this rapid iteration, ideally strict type
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const { formatPrice } = useUI();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('3-4Y');
    const [selectedColor, setSelectedColor] = useState('Yellow');

    const handleAddToCart = () => {
        addToCart({ ...product, color: selectedColor }, selectedSize);
        alert(`Added ${product.name} to Bag!`);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header Block */}
            <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-gray-500">
                    <span>Home</span> / <span>Little Legends</span> / <span>Everyday Wear</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-heading font-bold text-navy-900 mb-2 leading-tight">
                    {product.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-500">
                        {[1, 2, 3, 4].map(i => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
                        <Star size={16} fill="#E5E7EB" strokeWidth={0} />
                    </div>
                    <span className="text-sm text-gray-500 font-medium underline decoration-gray-300 decoration-1 underline-offset-4">(24 Reviews)</span>
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Bestseller</span>
                </div>

                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-navy-900">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                        <>
                            <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                            <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-sm">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                        </>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Variants */}
            <div className="space-y-6">
                {/* Colors */}
                <div>
                    <span className="text-sm font-bold text-navy-900 block mb-3">Select Color: <span className="text-gray-500 font-normal">{selectedColor}</span></span>
                    <div className="flex gap-3">
                        {product.colors.map((color: any) => (
                            <button
                                key={color.name}
                                onClick={() => setSelectedColor(color.name)}
                                className={`w-10 h-10 rounded-full border-2 p-1 transition-all ${selectedColor === color.name ? 'border-navy-900' : 'border-transparent hover:border-gray-200'}`}
                            >
                                <div className="w-full h-full rounded-full shadow-sm" style={{ backgroundColor: color.code }} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sizes */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-navy-900">Select Size</span>
                        <button className="text-xs text-coral-500 font-bold flex items-center gap-1 hover:underline">
                            <Ruler size={14} /> Size Guide
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size: string) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`min-w-[4rem] px-3 py-2.5 rounded-xl border text-sm font-bold transition-all ${selectedSize === size
                                    ? 'bg-navy-900 border-navy-900 text-white shadow-lg shadow-navy-900/20'
                                    : 'bg-white border-gray-200 text-navy-900 hover:border-navy-900 hover:bg-navy-50'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions (Desktop) */}
            <div className="hidden md:flex gap-4 mt-4">
                <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 border-2 border-navy-900 bg-white text-navy-900 font-bold rounded-xl hover:bg-navy-50 transition-colors flex items-center justify-center gap-2"
                >
                    <ShoppingBag size={20} /> Add to Cart
                </button>
                <button className="flex-1 py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-coral-500 transition-colors shadow-xl shadow-navy-900/20 flex items-center justify-center gap-2">
                    <Zap size={20} /> Buy Now
                </button>
            </div>

            {/* Trust Block */}
            <div className="bg-gray-50/50 rounded-2xl p-4 grid gap-3 mt-2 border border-gray-100">
                <div className="flex items-center gap-3">
                    <Truck size={18} className="text-navy-900" />
                    <span className="text-sm text-navy-800">Delivered by <b>Wed, 29 Jan</b></span>
                </div>
                <div className="flex items-center gap-3">
                    <RotateCcw size={18} className="text-navy-900" />
                    <span className="text-sm text-navy-800">7 Day Return Policy</span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-navy-900" />
                    <span className="text-sm text-navy-800">Cash on Delivery Available</span>
                </div>
            </div>

            {/* Highlights */}
            <ul className="grid grid-cols-2 gap-2 mt-2">
                {['100% Cotton', 'Breathable', 'Machine Wash', 'Kids Safe'].map(item => (
                    <li key={item} className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-coral-500" /> {item}
                    </li>
                ))}
            </ul>

            {/* Accordions */}
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
                {['Description', 'Material & Care', 'Shipping & Returns'].map(section => (
                    <details key={section} className="group">
                        <summary className="flex justify-between items-center font-bold text-navy-900 cursor-pointer list-none py-2">
                            {section}
                            <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-gray-400" />
                        </summary>
                        <p className="text-sm text-gray-500 mt-2 mb-4 leading-relaxed">
                            Premium quality cotton designed for everyday comfort. This item is crafted with care to ensure your little legend stays comfortable while exploring the world.
                        </p>
                    </details>
                ))}
            </div>
        </div>
    );
}
