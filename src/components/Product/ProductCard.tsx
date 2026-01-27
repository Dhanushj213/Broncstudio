'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { getProductImage } from '@/utils/sampleImages';

interface ProductProps {
    id: string;
    name: string;
    brand?: string;
    price: number;
    originalPrice?: number;
    image: string;
    badge?: string;
    colors?: string[];
}

export default function ProductCard(props: ProductProps) {
    const { id, name, brand, price, originalPrice, image, badge } = props;
    const [isHovered, setIsHovered] = useState(false);
    const { openQuickView, formatPrice } = useUI();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToast } = useToast();

    const imgSrc = image || getProductImage(id);

    return (
        <div
            className="group relative bg-white dark:bg-navy-800 rounded-lg overflow-hidden border border-gray-100 dark:border-white/5 hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-[3/4] bg-gray-50 dark:bg-white/5 overflow-hidden">
                {badge && (
                    <span className="absolute top-3 left-3 z-10 bg-navy-900 dark:bg-white dark:text-navy-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                        {badge}
                    </span>
                )}

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isInWishlist(id)) {
                            removeFromWishlist(id);
                            addToast(`${name} removed from Wishlist`, 'info');
                        } else {
                            addToWishlist({ id, name, price, image: imgSrc, size: 'One Size' });
                            addToast(`${name} added to Wishlist!`);
                        }
                    }}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${isInWishlist(id) ? 'bg-coral-50 dark:bg-coral-500/20 text-coral-500' : 'bg-white/80 dark:bg-black/40 backdrop-blur-sm text-gray-500 dark:text-white/60 hover:text-coral-500 dark:hover:text-coral-400 hover:bg-white dark:hover:bg-black/60'}`}
                >
                    <Heart size={16} fill={isInWishlist(id) ? "currentColor" : "none"} />
                </button>

                <Link href={`/product/${id}`} className="block w-full h-full relative cursor-pointer">
                    <img
                        src={imgSrc}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Overlay Actions */}
                    <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>

                        {/* Add to Bag */}
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(props, "One Size"); addToast(`${name} added to Bag!`); }}
                            className="w-full bg-white text-navy-900 font-bold py-2.5 rounded-full shadow-lg hover:bg-coral-500 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                        >
                            <ShoppingBag size={16} /> Add to Bag
                        </button>

                        {/* Quick View (Secondary) */}
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView(props); }}
                            className="w-full bg-white/90 backdrop-blur text-navy-900 font-bold py-2.5 rounded-full shadow-lg hover:bg-navy-900 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                        >
                            <Eye size={16} /> Quick View
                        </button>
                    </div>
                </Link>
            </div>

            <div className="p-4">
                {brand && <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{brand}</p>}
                <Link href={`/product/${id}`} className="block group-hover:text-coral-500 transition-colors">
                    <h3 className="text-xs md:text-sm font-bold text-navy-900 dark:text-white leading-tight mb-1 md:mb-2 line-clamp-2 md:min-h-[2.5em]">{name}</h3>
                </Link>

                <div className="flex flex-wrap items-baseline gap-1.5 md:gap-2">
                    <span className="text-sm md:text-base font-bold text-navy-900 dark:text-white">{formatPrice(price)}</span>
                    {originalPrice && (
                        <>
                            <span className="text-[10px] md:text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                            <span className="text-[10px] font-bold text-coral-500 dark:text-coral-400">
                                {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
