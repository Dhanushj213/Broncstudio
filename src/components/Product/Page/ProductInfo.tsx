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

    const meta = product.metadata || {};
    const colors = meta.colors || []; // Array of {name, code}
    const sizes = meta.sizes || []; // Array of strings
    const highlights = meta.highlights || []; // Array of strings

    const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
    const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');

    // Reset selection if product changes (optional, but good practice)
    React.useEffect(() => {
        if (sizes.length > 0) setSelectedSize(sizes[0]);
        if (colors.length > 0) setSelectedColor(colors[0].name);
    }, [product]);

    const handleAddToCart = () => {
        if (sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart({ ...product, color: selectedColor }, selectedSize);
        alert(`Added ${product.name} to Bag!`);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header Block */}
            <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-gray-500">
                    <span>Home</span> / <span>Shop</span> / <span>{product.name}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-navy-900 mb-2 leading-tight">
                    {product.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
                    </div>
                    {meta.is_featured && (
                        <span className="ml-2 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Featured</span>
                    )}
                </div>

                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-navy-900">{formatPrice(product.price)}</span>
                    {product.compare_at_price && (
                        <>
                            <span className="text-xl text-gray-400 line-through">{formatPrice(product.compare_at_price)}</span>
                            <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-sm">
                                {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% OFF
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
                {colors.length > 0 && (
                    <div>
                        <span className="text-sm font-bold text-navy-900 block mb-3">Select Color: <span className="text-gray-500 font-normal">{selectedColor}</span></span>
                        <div className="flex gap-3">
                            {colors.map((color: any) => (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(color.name)}
                                    className={`w-10 h-10 rounded-full border-2 p-1 transition-all ${selectedColor === color.name ? 'border-navy-900' : 'border-transparent hover:border-gray-200'}`}
                                    title={color.name}
                                >
                                    <div className="w-full h-full rounded-full shadow-sm" style={{ backgroundColor: color.code }} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sizes */}
                {sizes.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-bold text-navy-900">Select Size</span>
                            <button className="text-xs text-coral-500 font-bold flex items-center gap-1 hover:underline">
                                <Ruler size={14} /> Size Guide
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((size: string) => (
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
                )}
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
                    <span className="text-sm text-navy-800">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                    <RotateCcw size={18} className="text-navy-900" />
                    <span className="text-sm text-navy-800">{meta.shipping_returns ? 'Easy Returns' : '7 Day Return Policy'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-navy-900" />
                    <span className="text-sm text-navy-800">Cash on Delivery Available</span>
                </div>
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
                <ul className="grid grid-cols-2 gap-2 mt-2">
                    {highlights.map((item: string) => (
                        <li key={item} className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-coral-500" /> {item}
                        </li>
                    ))}
                </ul>
            )}

            {/* Accordions */}
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
                {/* Description */}
                <details className="group" open>
                    <summary className="flex justify-between items-center font-bold text-navy-900 cursor-pointer list-none py-2">
                        Description
                        <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-gray-400" />
                    </summary>
                    <p className="text-sm text-gray-500 mt-2 mb-4 leading-relaxed">
                        {product.description || 'No description available.'}
                    </p>
                </details>

                {/* Material & Care */}
                {meta.material_care && (
                    <details className="group">
                        <summary className="flex justify-between items-center font-bold text-navy-900 cursor-pointer list-none py-2">
                            Material & Care
                            <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-gray-400" />
                        </summary>
                        <p className="text-sm text-gray-500 mt-2 mb-4 leading-relaxed whitespace-pre-line">
                            {meta.material_care}
                        </p>
                    </details>
                )}

                {/* Shipping & Returns */}
                {meta.shipping_returns && (
                    <details className="group">
                        <summary className="flex justify-between items-center font-bold text-navy-900 cursor-pointer list-none py-2">
                            Shipping & Returns
                            <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-gray-400" />
                        </summary>
                        <p className="text-sm text-gray-500 mt-2 mb-4 leading-relaxed whitespace-pre-line">
                            {meta.shipping_returns}
                        </p>
                    </details>
                )}
            </div>
        </div>
    );
}
