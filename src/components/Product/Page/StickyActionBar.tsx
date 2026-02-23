'use client';

import React from 'react';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingBag, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


interface StickyActionBarProps {
    product: any;
    selectedSize: string;
    selectedColor: string;
    isOutOfStock: boolean;
}

export default function StickyActionBar({ product, selectedSize, selectedColor, isOutOfStock }: StickyActionBarProps) {
    const { formatPrice } = useUI();
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [isVisible, setIsVisible] = React.useState(false);

    const isWishlisted = isInWishlist(product.id);

    // Show bar only after scrolling past the main action button
    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 800) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        addToCart({ ...product, color: selectedColor }, selectedSize);
    };

    const toggleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(product.id);
            addToast('Removed from wishlist', 'success');
        } else {
            addToWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || product.image || '/images/placeholder.jpg',
            });
            addToast('Added to wishlist', 'success');
        }
    };

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-1 border-t border-[#E5E5E5] dark:border-white/10 p-3 px-4 z-50 md:hidden flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom"
        >
            {/* Wishlist Button (Mobile) */}
            <button
                onClick={toggleWishlist}
                className="h-[48px] w-[48px] bg-white border border-[#E5E5E5] rounded-[8px] flex items-center justify-center text-[#111] dark:bg-transparent dark:border-white/30 dark:text-white"
            >
                <Heart
                    size={20}
                    fill={isWishlisted ? "#ef4444" : "none"}
                    className={isWishlisted ? 'text-red-500 border-red-500' : ''}
                />
            </button>

            <button
                onClick={isOutOfStock ? undefined : handleAddToCart}
                className={`h-[48px] flex-1 rounded-[8px] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${isOutOfStock
                    ? 'bg-[#E5E5E5] text-[#B5B5B5] dark:bg-white/10 dark:text-white/30 cursor-not-allowed'
                    : 'bg-[#111] text-white dark:bg-white dark:text-black cursor-pointer hover:bg-black/80 dark:hover:bg-gray-200'
                    }`}
            >
                {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
            </button>
        </motion.div>
    );
}
