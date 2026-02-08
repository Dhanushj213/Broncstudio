'use client';

import React, { useState } from 'react';
import { Star, Truck, RotateCcw, ShieldCheck, ChevronDown, Ruler, ShoppingBag, Zap } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

interface ProductInfoProps {
    product: any; // Using any for simplicity in this rapid iteration, ideally strict type
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const router = useRouter();
    const { formatPrice } = useUI();
    const { addToCart } = useCart();
    const { addToast } = useToast();

    const meta = product.metadata || {};
    const colors = meta.colors || []; // Array of {name, code}
    const sizes = meta.sizes || []; // Array of strings
    const highlights = meta.highlights || []; // Array of strings



    const stockStatus = meta.stock_status || 'in_stock'; // in_stock, out_of_stock, low_stock
    const isOutOfStock = stockStatus === 'out_of_stock';
    const isLowStock = stockStatus === 'low_stock';

    const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
    const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');

    // Reset selection if product changes (optional, but good practice)
    React.useEffect(() => {
        if (sizes.length > 0) setSelectedSize(sizes[0]);
        if (colors.length > 0) setSelectedColor(colors[0].name);
    }, [product]);

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        if (sizes.length > 0 && !selectedSize) {
            addToast('Please select a size', 'error');
            return;
        }
        addToCart({ ...product, color: selectedColor }, selectedSize);
        addToast(`${product.name} added to your bag!`, 'success');
    };

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        if (sizes.length > 0 && !selectedSize) {
            addToast('Please select a size', 'error');
            return;
        }
        addToCart({ ...product, color: selectedColor }, selectedSize);
        router.push('/cart');
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header Block */}
            <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-secondary">
                    <span>Home</span> / <span>Shop</span> / <span>{product.name}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2 leading-tight">
                    {product.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
                    </div>
                    {meta.is_featured && (
                        <span className="ml-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Featured</span>
                    )}
                    {isLowStock && (
                        <span className="ml-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Only Few Left!</span>
                    )}
                    {isOutOfStock && (
                        <span className="ml-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Out of Stock</span>
                    )}
                </div>

                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                    {product.compare_at_price && (
                        <>
                            <span className="text-xl text-secondary line-through">{formatPrice(product.compare_at_price)}</span>
                            <span className="text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-sm">
                                {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% OFF
                            </span>
                        </>
                    )}
                </div>
                <p className="text-xs text-secondary mt-1">Inclusive of all taxes</p>
            </div>

            <div className="h-px bg-border" />

            {/* Variants */}
            {!isOutOfStock && (
                <div className="space-y-6">
                    {/* Colors */}
                    {colors.length > 0 && (
                        <div>
                            <span className="text-sm font-bold text-primary block mb-3">Select Color: <span className="text-secondary font-normal">{selectedColor}</span></span>
                            <div className="flex gap-3">
                                {colors.map((color: any) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-10 h-10 rounded-full border-2 p-1 transition-all ${selectedColor === color.name ? 'border-black dark:border-white' : 'border-transparent hover:border-subtle'}`}
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
                                <span className="text-sm font-bold text-primary">Select Size</span>
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
                                            ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-lg shadow-black/20 dark:shadow-white/20'
                                            : 'bg-transparent border-subtle text-primary hover:border-black dark:hover:border-white hover:bg-surface-2'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Actions (Desktop) */}
            <div className="hidden md:flex gap-4 mt-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-4 border-2 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${isOutOfStock
                        ? 'border-subtle bg-surface-2 text-secondary cursor-not-allowed'
                        : 'border-black dark:border-white bg-transparent text-primary hover:bg-surface-2'
                        }`}
                >
                    <ShoppingBag size={20} /> {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
                </button>
                <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`flex-1 py-4 font-bold rounded-xl transition-colors shadow-xl flex items-center justify-center gap-2 ${isOutOfStock
                        ? 'bg-gray-300 dark:bg-gray-700 text-white cursor-not-allowed shadow-none'
                        : 'bg-black dark:bg-white text-white dark:text-black hover:bg-coral-500 dark:hover:bg-coral-400 shadow-black/20 dark:shadow-white/20'
                        }`}
                >
                    <Zap size={20} /> {isOutOfStock ? 'Sold Out' : 'Buy Now'}
                </button>
            </div>

            {/* Trust Block */}
            <div className="bg-surface-2/50 rounded-2xl p-4 grid gap-3 mt-2 border border-subtle">
                <div className="flex items-center gap-3">
                    <Truck size={18} className="text-primary" />
                    <span className="text-sm text-primary">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                    <RotateCcw size={18} className="text-primary" />
                    <span className="text-sm text-primary">{meta.shipping_returns ? 'Easy Returns' : '7 Day Return Policy'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-primary" />
                    <span className="text-sm text-primary">Cash on Delivery Available</span>
                </div>
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
                <ul className="grid grid-cols-2 gap-2 mt-2">
                    {highlights.map((item: string) => (
                        <li key={item} className="text-xs text-secondary flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-coral-500" /> {item}
                        </li>
                    ))}
                </ul>
            )}

            {/* Accordions */}
            <div className="border-t border-subtle mt-4 pt-4 space-y-2">
                {/* Description */}
                <details className="group" open>
                    <summary className="flex justify-between items-center font-bold text-primary cursor-pointer list-none py-2">
                        Description
                        <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-secondary" />
                    </summary>
                    <p className="text-sm text-secondary mt-2 mb-4 leading-relaxed">
                        {product.description || 'No description available.'}
                    </p>
                </details>

                {/* Material & Care */}
                {meta.material_care && (
                    <details className="group">
                        <summary className="flex justify-between items-center font-bold text-primary cursor-pointer list-none py-2">
                            Material & Care
                            <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-secondary" />
                        </summary>
                        <p className="text-sm text-secondary mt-2 mb-4 leading-relaxed whitespace-pre-line">
                            {meta.material_care}
                        </p>
                    </details>
                )}

                {/* Shipping & Returns */}
                {meta.shipping_returns && (
                    <details className="group">
                        <summary className="flex justify-between items-center font-bold text-primary cursor-pointer list-none py-2">
                            Shipping & Returns
                            <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-secondary" />
                        </summary>
                        <p className="text-sm text-secondary mt-2 mb-4 leading-relaxed whitespace-pre-line">
                            {meta.shipping_returns}
                        </p>
                    </details>
                )}
            </div>
        </div>
    );
}
