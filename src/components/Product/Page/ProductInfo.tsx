'use client';

import React, { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, ChevronDown, Ruler, ShoppingBag, Zap } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

interface ProductInfoProps {
    product: any;
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

    const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
    const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');

    const stockStatus = meta.stock_status || 'in_stock'; // in_stock, out_of_stock, low_stock
    const isOutOfStock = stockStatus === 'out_of_stock';
    const isLowStock = stockStatus === 'low_stock';

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
        <div className="flex flex-col gap-4 md:gap-8 px-6 md:px-0">
            {/* Header Block */}
            <div className="space-y-1 md:space-y-3">
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary opacity-60">
                    <span>Home</span> <span className="w-1 h-1 rounded-full bg-border" /> <span>{product.category?.name || 'Shop'}</span>
                </div>
                <h1 className="text-xl md:text-4xl font-heading font-black text-primary leading-[1.1] tracking-tight">
                    {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                    <div className="flex items-center gap-2">
                        {meta.is_featured && (
                            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Featured</span>
                        )}
                        {isLowStock && (
                            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Low Stock</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4 md:pt-6">
                    <div className="flex flex-col">
                        <span className="text-3xl md:text-5xl font-black text-primary tracking-tighter">{formatPrice(product.price)}</span>
                    </div>
                    {product.compare_at_price && (
                        <div className="flex flex-col">
                            <span className="text-base md:text-xl text-secondary line-through opacity-50 font-bold">{formatPrice(product.compare_at_price)}</span>
                            <span className="text-green-500 text-[10px] md:text-xs font-black uppercase tracking-tighter">
                                Save {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% Today
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="h-px bg-divider md:my-2" />

            {/* Variants */}
            {!isOutOfStock && (
                <div className="space-y-6 md:space-y-10">

                    {/* Colors */}
                    {colors.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-primary">Color</span>
                                <span className="text-[11px] font-bold text-secondary uppercase">{selectedColor}</span>
                            </div>
                            <div className="flex gap-4">
                                {colors.map((color: any, i: number) => (
                                    <button
                                        key={`${color.name}-${i}`}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-12 h-12 rounded-2xl border-2 p-1.5 transition-all duration-300 ${selectedColor === color.name ? 'border-primary scale-110 shadow-lg' : 'border-divider hover:border-subtle hover:scale-105'}`}
                                        title={color.name}
                                    >
                                        <div className="w-full h-full rounded-xl shadow-inner" style={{ backgroundColor: color.code }} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sizes */}
                    {sizes.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-primary">Size</span>
                                <button className="text-[10px] md:text-xs text-accent-orange font-black uppercase tracking-widest flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                                    <Ruler size={14} /> Size Guide
                                </button>
                            </div>
                            <div className="grid grid-cols-4 md:flex md:flex-wrap gap-2 md:gap-3">
                                {sizes.map((size: string) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`flex items-center justify-center py-3.5 md:min-w-[4.5rem] md:px-5 rounded-2xl border-2 text-[13px] md:text-sm font-black transition-all duration-300 ${selectedSize === size
                                            ? 'bg-primary border-primary text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_20px_rgba(255,255,255,0.1)]'
                                            : 'bg-transparent border-divider text-secondary hover:border-subtle hover:bg-surface-2'
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

            {/* Actions (Desktop) - On Mobile we rely more on Sticky bar but these should still look perfect */}
            <div className="flex gap-3 md:gap-5 pt-4 md:pt-8 mb-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 group relative overflow-hidden h-14 md:h-16 font-black uppercase tracking-widest text-xs md:text-sm rounded-2xl transition-all active:scale-95 ${isOutOfStock
                        ? 'bg-surface-3 text-disabled cursor-not-allowed'
                        : 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white'
                        }`}
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        <ShoppingBag size={20} /> {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                    </span>
                </button>
                <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`flex-1 group relative overflow-hidden h-14 md:h-16 font-black uppercase tracking-widest text-xs md:text-sm rounded-2xl transition-all active:scale-95 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_15px_30px_-5px_rgba(255,255,255,0.1)] ${isOutOfStock
                        ? 'bg-surface-3 text-disabled cursor-not-allowed shadow-none'
                        : 'bg-primary text-secondary-foreground hover:bg-primary/90'
                        }`}
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        <Zap size={20} className="fill-current" /> Fast Checkout
                    </span>
                </button>
            </div>

            {/* Premium Trust Cards */}
            <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="flex flex-col gap-3 p-4 bg-surface-2/40 rounded-2xl border border-divider">
                    <Truck size={18} className="text-accent-orange" />
                    <div className="space-y-0.5">
                        <p className="text-[11px] font-black uppercase tracking-wider text-primary">Free Express</p>
                        <p className="text-[10px] text-secondary font-medium">Delivery in 2-4 Days</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 p-4 bg-surface-2/40 rounded-2xl border border-divider">
                    <ShieldCheck size={18} className="text-accent-orange" />
                    <div className="space-y-0.5">
                        <p className="text-[11px] font-black uppercase tracking-wider text-primary">Safe Checkout</p>
                        <p className="text-[10px] text-secondary font-medium">COD & Secure Pay</p>
                    </div>
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
