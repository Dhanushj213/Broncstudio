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
                    className="fixed inset-0 z-[1100] bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={closeQuickView}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh] md:h-auto"
                    >
                        {/* Image Side */}
                        <div className="bg-gray-50 h-[300px] md:h-full relative">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            <button
                                onClick={closeQuickView}
                                className="absolute top-4 left-4 md:hidden bg-white/50 backdrop-blur p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Info Side */}
                        <div className="p-8 md:p-10 flex flex-col h-full overflow-y-auto">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    {product.brand && <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{product.brand}</p>}
                                    <h2 className="text-2xl font-heading font-bold text-navy-900 mb-2">{product.name}</h2>
                                    <div className="flex items-center gap-1 text-yellow-400 mb-4">
                                        <Star size={16} fill="currentColor" />
                                        <Star size={16} fill="currentColor" />
                                        <Star size={16} fill="currentColor" />
                                        <Star size={16} fill="currentColor" />
                                        <Star size={16} fill="currentColor" />
                                        <span className="text-gray-400 text-xs ml-1">(24 Reviews)</span>
                                    </div>
                                </div>
                                <button onClick={closeQuickView} className="hidden md:block text-gray-400 hover:text-navy-900">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl font-bold text-navy-900">{formatPrice(product.price)}</span>
                                {product.originalPrice && (
                                    <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                                )}
                            </div>

                            {/* Size Selector */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Select Size</label>
                                    {error && <span className="text-[10px] md:text-xs font-bold text-red-500 animate-pulse tracking-wide">{error}</span>}
                                </div>
                                <div className="flex gap-3">
                                    {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                        <button
                                            key={size}
                                            onClick={() => { setSelectedSize(size); setError(''); }}
                                            className={`w-12 h-12 rounded-lg border flex items-center justify-center font-bold transition-all ${selectedSize === size
                                                ? 'bg-navy-900 text-white border-navy-900 scale-110 shadow-lg'
                                                : error ? 'border-red-200 text-navy-900 bg-red-50' : 'text-navy-900 border-gray-200 hover:border-navy-900 hover:bg-navy-50'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto space-y-3">
                                <button
                                    onClick={handleAddToBag}
                                    className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-coral-500 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-navy-900/10"
                                >
                                    <ShoppingBag size={20} /> Add to Bag
                                </button>
                                <Link
                                    href={`/product/${product.id}`}
                                    onClick={closeQuickView}
                                    className="block w-full text-center py-3 text-navy-900 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
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
