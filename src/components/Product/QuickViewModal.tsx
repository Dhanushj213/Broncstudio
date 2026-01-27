'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function QuickViewModal() {
    const { quickViewProduct, closeQuickView, formatPrice, userName } = useUI();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [error, setError] = useState<string>(''); // Local error state
    const product = quickViewProduct;

    // Reset size when product changes
    useEffect(() => {
        setSelectedSize('');
        setError('');
    }, [product]);

    const handleAddToBag = () => {
        if (!selectedSize) {
            const msg = userName ? `${userName.toUpperCase()}, PLEASE SELECT THE SIZE` : 'PLEASE SELECT THE SIZE';
            setError(msg);
            return;
        }
        addToCart(product, selectedSize);
        alert(`Added ${product?.name} to Bag!`);
        closeQuickView();
    };

    return (
        <AnimatePresence>
            {product && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1100] bg-navy-900/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 pb-safe"
                    onClick={closeQuickView}
                >
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-navy-900 rounded-t-[32px] md:rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh] md:max-h-[85vh] md:h-auto"
                    >
                        {/* Image Side - Compact for Mobile */}
                        <div className="bg-gray-50 h-[25vh] md:h-full relative shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            <button
                                onClick={closeQuickView}
                                className="absolute top-4 right-4 md:hidden bg-white/50 dark:bg-black/30 backdrop-blur p-2 rounded-full text-navy-900 dark:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Info Side - Scrollable if needed but optimized to fit */}
                        <div className="p-5 md:p-10 flex flex-col h-full overflow-y-auto no-scrollbar">
                            <div className="flex justify-between items-start mb-2 md:mb-4">
                                <div>
                                    {product.brand && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>}
                                    <h2 className="text-lg md:text-2xl font-heading font-bold text-navy-900 dark:text-white mb-1 md:mb-2">{product.name}</h2>
                                    <div className="flex items-center gap-1 text-yellow-400 mb-2 md:mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill="currentColor" className={i < 4 ? "text-yellow-400" : "text-gray-300"} />
                                        ))}
                                        <span className="text-gray-400 text-[10px] ml-1">(24 Reviews)</span>
                                    </div>
                                </div>
                                <button onClick={closeQuickView} className="hidden md:block text-gray-400 hover:text-navy-900 dark:hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex items-baseline gap-2 mb-4 md:mb-6">
                                <span className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white">{formatPrice(product.price)}</span>
                                {product.originalPrice && (
                                    <span className="text-sm md:text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                                )}
                            </div>

                            {/* Size Selector */}
                            <div className="mb-4 md:mb-8">
                                <div className="flex justify-between items-center mb-2 md:mb-3">
                                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-500 block">Select Size</label>
                                    {error && <span className="text-[10px] md:text-xs font-bold text-red-500 animate-pulse tracking-wide">{error}</span>}
                                </div>
                                <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-1">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                        <button
                                            key={size}
                                            onClick={() => { setSelectedSize(size); setError(''); }}
                                            className={`min-w-[40px] h-[40px] md:w-12 md:h-12 rounded-lg border flex items-center justify-center font-bold text-sm transition-all shrink-0 ${selectedSize === size
                                                ? 'bg-navy-900 dark:bg-white text-white dark:text-navy-900 border-navy-900 dark:border-white scale-105 shadow-md'
                                                : error ? 'border-red-200 text-navy-900 bg-red-50' : 'text-navy-900 dark:text-white border-gray-200 dark:border-white/20 hover:border-navy-900 dark:hover:border-white'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col gap-2 md:gap-3 pb-safe">
                                <button
                                    onClick={handleAddToBag}
                                    className="w-full py-3 md:py-4 bg-navy-900 dark:bg-white text-white dark:text-navy-900 font-bold rounded-xl hover:bg-coral-500 transition-colors flex items-center justify-center gap-2 shadow-lg md:shadow-xl active:scale-[0.98]"
                                >
                                    <ShoppingBag size={18} /> Add to Bag
                                </button>
                                <Link
                                    href={`/product/${product.id}`}
                                    onClick={closeQuickView}
                                    className="block w-full text-center py-2.5 md:py-3 text-navy-900 dark:text-white font-bold border border-gray-200 dark:border-white/20 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm md:text-base"
                                >
                                    View Full Details
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
