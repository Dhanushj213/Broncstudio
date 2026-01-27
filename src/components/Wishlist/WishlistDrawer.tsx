'use client';

import React from 'react';
import { useUI } from '@/context/UIContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function WishlistDrawer() {
    const { isWishlistOpen, closeWishlist } = useUI();
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleMoveToBag = (item: any) => {
        // Add to cart with default or stored size
        addToCart(item, item.size || 'One Size');
        removeFromWishlist(item.id);
        // Alert handled by addToCart or UI notification
    };

    return (
        <AnimatePresence>
            {isWishlistOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1100] bg-navy-900/40 backdrop-blur-sm"
                        onClick={closeWishlist}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[1101] w-full max-w-md bg-white shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-heading font-bold text-navy-900">Your Wishlist ({wishlistItems.length})</h2>
                            <button onClick={closeWishlist} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {wishlistItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <span className="text-4xl mb-4">💔</span>
                                    <p className="text-gray-500 font-medium">Your wishlist is empty.</p>
                                    <button onClick={closeWishlist} className="mt-4 text-navy-900 font-bold underline">Start Exploring</button>
                                </div>
                            ) : (
                                wishlistItems.map(item => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <h3 className="text-navy-900 font-bold leading-tight line-clamp-2">{item.name}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">Size: {item.size || 'N/A'}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromWishlist(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="mt-auto">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-navy-900 font-bold">₹{item.price}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleMoveToBag(item)}
                                                    className="w-full py-2.5 bg-navy-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-coral-500 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95"
                                                >
                                                    <ShoppingBag size={14} /> Move to Bag
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={closeWishlist}
                                className="w-full py-3 border border-navy-900 text-navy-900 font-bold rounded-xl hover:bg-navy-900 hover:text-white transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
