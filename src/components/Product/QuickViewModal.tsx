'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Check, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';
import clsx from 'clsx';

export default function QuickViewModal() {
    const router = useRouter();
    const { quickViewProduct, closeQuickView, formatPrice, userName } = useUI();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [showSizeGuide, setShowSizeGuide] = useState(false);
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

    return (
        <>
            <AnimatePresence>
                {product && (
                    <motion.div
                        key="quick-view-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 pb-safe"
                        onClick={closeQuickView}
                    >
                        <motion.div
                            key="quick-view-modal-content"
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                            }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{
                                type: "spring", damping: 25, stiffness: 300,
                            }}
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0, bottom: 0.5 }}
                            onDragEnd={(e, info) => {
                                if (info.offset.y > 100 || info.velocity.y > 500) {
                                    closeQuickView();
                                }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-navy-900 w-full max-w-5xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] md:min-h-[500px]"
                        >
                            {/* Drag Indicator (Mobile Only) */}
                            <div className="w-full flex justify-center pt-3 pb-1 md:hidden absolute top-0 left-0 z-50 pointer-events-none">
                                <div className="w-12 h-1.5 rounded-full bg-white/40 backdrop-blur-md shadow-sm"></div>
                            </div>

                            {/* LEFT: Image Section (Full Height on Desktop) */}
                            <div className="w-full md:w-1/2 bg-gray-100 dark:bg-black/20 relative md:h-auto h-[35vh] shrink-0 mt-3 md:mt-0">
                                <Image
                                    src={getGoogleDriveDirectLink(product.image, { width: 1000, quality: 85 })}
                                    alt={product.name}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                    placeholder="blur"
                                    blurDataURL={getGoogleDriveDirectLink(product.image, { width: 40, blur: 5, quality: 20 })}
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
                                    className="absolute top-4 right-4 md:hidden w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-black shadow-xl border border-black/5 transition-all active:scale-90 z-50 hover:bg-white"
                                >
                                    <X size={22} className="stroke-[2.5px]" />
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
                                                                "w-8 h-8 rounded-[8px] transition-all flex items-center justify-center shrink-0",
                                                                selectedColor === colorName
                                                                    ? "ring-2 ring-offset-2 ring-navy-900 dark:ring-white dark:ring-offset-navy-900 scale-[1.05]"
                                                                    : "ring-1 ring-black/10 dark:ring-white/20 hover:ring-black/30 dark:hover:ring-white/40 border border-black/5"
                                                            )}
                                                            style={{ backgroundColor: colorValue }}
                                                            title={colorName}
                                                        />
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
                                                <button
                                                    onClick={() => setShowSizeGuide(true)}
                                                    className="text-xs text-coral-500 font-bold hover:underline"
                                                >
                                                    Size Guide
                                                </button>
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
                                            onClick={inStock ? handleAddToBag : undefined}
                                            className={clsx(
                                                "w-full py-4 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-lg transition-all",
                                                inStock
                                                    ? "bg-navy-900 text-white hover:bg-coral-500 hover:shadow-coral-500/20 dark:bg-white dark:text-slate-900 cursor-pointer"
                                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            )}
                                        >
                                            <ShoppingBag size={18} />
                                            {inStock ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push(`/product/${product.id}`);
                                                closeQuickView();
                                            }}
                                            className="block w-full text-center py-4 text-sm font-bold uppercase tracking-widest transition-all rounded-lg bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 text-navy-900 dark:text-white"
                                        >
                                            View Full Details
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Size Guide Modal Overlay */}
            <AnimatePresence>
                {showSizeGuide && (
                    <motion.div
                        key="size-guide-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setShowSizeGuide(false)}
                    >
                        <motion.div
                            key="size-guide-modal-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{}}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-navy-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                                <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">Size Guide</h3>
                                <button
                                    onClick={() => setShowSizeGuide(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors font-bold text-2xl dark:text-white"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="p-4 md:p-8 max-h-[70vh] overflow-y-auto">
                                {meta.size_guide ? (
                                    <div className="relative w-full aspect-square md:aspect-video rounded-xl overflow-hidden bg-gray-50 dark:bg-white/5">
                                        <Image
                                            src={getGoogleDriveDirectLink(meta.size_guide, { width: 800, quality: 80 })}
                                            alt="Size Guide"
                                            fill
                                            unoptimized
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            placeholder="blur"
                                            blurDataURL={getGoogleDriveDirectLink(meta.size_guide, { width: 40, blur: 5, quality: 20 })}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-400">
                                        <p className="font-bold">Standard Sizing Guide</p>
                                        <p className="text-xs mt-2">No specific chart available for this product.</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
                                <button
                                    onClick={() => setShowSizeGuide(false)}
                                    className="w-full h-14 bg-navy-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg"
                                >
                                    Close Guide
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
