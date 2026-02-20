'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Check, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

export default function QuickViewModal() {
    const { quickViewProduct, closeQuickView, formatPrice, userName } = useUI();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [error, setError] = useState<string>('');

    const product = quickViewProduct;

    // Derived State
    const meta = product?.metadata || {};
    const stockStatus = meta.stock_status || product?.stock_status || 'in_stock';
    const inStock = stockStatus !== 'out_of_stock' && !product?.is_sold_out;

    const colors = meta.colors || product?.colors || [];
    const sizes = meta.sizes || product?.sizes || []; // Fallback if needed
    const hasColors = colors.length > 0;
    const hasSizes = sizes.length > 0;

    // Reset state when product changes
    // Reset state when product changes
    useEffect(() => {
        if (product) {
            // No auto-selection, force user to choose
            setSelectedColor('');
            setSelectedSize('');
            setError('');
        }
    }, [product]);

    const handleAddToBag = () => {
        if (hasColors && !selectedColor) {
            const msg = 'Please select a color.';
            setError(msg);
            return;
        }

        if (hasSizes && !selectedSize) {
            const msg = 'Please select a size.';
            setError(msg);
            return;
        }

        addToCart({ ...product, color: selectedColor }, selectedSize);
        closeQuickView();
    };

    if (!product) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 pb-safe"
                onClick={closeQuickView}
            >
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-navy-900 w-full max-w-5xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] md:min-h-[500px]"
                >
                    {/* LEFT: Image Section (Full Height on Desktop) */}
                    <div className="w-full md:w-1/2 bg-gray-100 dark:bg-black/20 relative md:h-auto h-[35vh] shrink-0">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {/* Sold Out Seal */}
                        {(product.badge === 'Sold Out' || product.is_sold_out) ? (
                            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-4">
                                <span className="border-4 md:border-8 border-red-600/80 text-red-600/80 text-xl md:text-3xl font-black px-4 py-2 md:px-6 md:py-3 uppercase tracking-tighter -rotate-12 border-double rounded-lg whitespace-nowrap select-none">
                                    Sold Out
                                </span>
                            </div>
                        ) : product.badge && (
                            <span className="absolute top-4 left-4 bg-navy-900 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                                {product.badge}
                            </span>
                        )}
                        {/* Mobile Close Button */}
                        <button
                            onClick={closeQuickView}
                            className="absolute top-4 right-4 md:hidden w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-navy-900 shadow-sm"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* RIGHT: Details Section */}
                    <div className="w-full md:w-1/2 flex flex-col h-full overflow-y-auto custom-scrollbar">
                        <div className="p-6 md:p-10 flex flex-col h-full">

                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                                        {product.brand || 'BroncStudio'}
                                    </h3>
                                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy-900 dark:text-white leading-tight">
                                        {product.name}
                                    </h2>
                                </div>
                                <button
                                    onClick={closeQuickView}
                                    className="hidden md:flex text-gray-400 hover:text-navy-900 dark:hover:text-white transition-colors"
                                >
                                    <X size={28} />
                                </button>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-white/10 pb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-coral-500">{formatPrice(product.price)}</span>
                                    {product.originalPrice && (
                                        <span className="text-base text-gray-400 line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-6">
                                {inStock ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded">
                                        <Check size={14} /> In Stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded">
                                        <AlertCircle size={14} /> Sold Out
                                    </span>
                                )}
                                <span className="text-xs text-gray-400">SKU: {product.id.slice(0, 8).toUpperCase()}</span>
                            </div>

                            {/* Color Swatches */}
                            {hasColors && (
                                <div className="mb-6">
                                    <span className="text-xs font-bold uppercase tracking-wider text-navy-900 dark:text-white block mb-3">
                                        Color: <span className="text-gray-500 font-normal capitalize">{selectedColor}</span>
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((colorItem: any) => {
                                            // Handle both simple string or object {name, value/hex}
                                            const isObject = typeof colorItem === 'object';
                                            const colorName = isObject ? colorItem.name : colorItem;
                                            const colorValue = isObject ? (colorItem.hex || colorItem.value || colorItem.name) : colorItem;

                                            return (
                                                <button
                                                    key={colorName}
                                                    onClick={() => setSelectedColor(colorName)}
                                                    className={clsx(
                                                        "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
                                                        selectedColor === colorName
                                                            ? "border-navy-900 dark:border-white scale-110"
                                                            : "border-gray-200 dark:border-white/10 hover:border-gray-300"
                                                    )}
                                                    style={{ backgroundColor: colorValue }}
                                                    title={colorName}
                                                >
                                                    {selectedColor === colorName && (
                                                        <Check size={12} className={clsx(colorName.toLowerCase() === 'white' ? "text-black" : "text-white")} />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Size Selector */}
                            {hasSizes && (
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-navy-900 dark:text-white">
                                            Size: <span className="text-red-500 font-normal normal-case">{error}</span>
                                        </span>
                                        <button className="text-xs text-coral-500 font-bold hover:underline">Size Guide</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((size: string) => (
                                            <button
                                                key={size}
                                                onClick={() => { setSelectedSize(size); setError(''); }}
                                                className={clsx(
                                                    "min-w-[48px] h-10 px-3 rounded border text-sm font-bold transition-all",
                                                    selectedSize === size
                                                        ? "bg-navy-900 text-white border-navy-900 dark:bg-white dark:text-slate-900"
                                                        : "bg-transparent text-gray-600 border-gray-200 hover:border-navy-900 dark:text-gray-300 dark:border-white/10 dark:hover:border-white"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-auto space-y-3">
                                <button
                                    onClick={handleAddToBag}
                                    disabled={!inStock}
                                    className={clsx(
                                        "w-full py-4 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-lg transition-all",
                                        inStock
                                            ? "bg-navy-900 text-white hover:bg-coral-500 hover:shadow-coral-500/20 dark:bg-white dark:text-slate-900"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    )}
                                >
                                    <ShoppingBag size={18} />
                                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                <Link
                                    href={`/product/${product.id}`}
                                    onClick={closeQuickView}
                                    className="block w-full text-center py-3 text-sm font-bold uppercase tracking-widest text-navy-900 dark:text-white hover:text-coral-500 transition-colors"
                                >
                                    View Full Details
                                </Link>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
