'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { getProductImage } from '@/utils/sampleImages';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';
import clsx from 'clsx';

interface ProductProps {
    id: string;
    name: string;
    brand?: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: string[]; // New prop for slideshow
    badge?: string;
    secondaryImage?: string;
    metadata?: any;
    is_sold_out?: boolean;
}

export default function ProductCard(props: ProductProps) {
    const { id, name, brand, price, originalPrice, image, images, badge } = props;
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { openQuickView, formatPrice } = useUI();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToast } = useToast();

    // Slideshow logic
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHovered && images && images.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 1500); // Cycle every 1.5 seconds
        } else {
            setCurrentImageIndex(0);
        }
        return () => clearInterval(interval);
    }, [isHovered, images]);

    const displayImages = images && images.length > 0 ? images : [image];
    const currentImgSrc = getGoogleDriveDirectLink(displayImages[currentImageIndex] || image);

    return (
        <div
            className="group relative bg-white dark:bg-navy-800 rounded-lg overflow-hidden border border-gray-100 dark:border-white/5 hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative bg-gray-50 dark:bg-white/5 overflow-hidden" style={{ aspectRatio: '3/4' }}>
                {/* Sold Out Seal */}
                {(badge === 'Sold Out' || props.is_sold_out) ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-4">
                        <span className="border-4 md:border-8 border-red-600/80 text-red-600/80 text-xl md:text-3xl font-black px-4 py-2 md:px-6 md:py-3 uppercase tracking-tighter -rotate-12 border-double rounded-lg scale-110 md:scale-100 whitespace-nowrap select-none">
                            Sold Out
                        </span>
                    </div>
                ) : badge && (
                    <span className="absolute top-3 left-3 z-10 bg-black text-white border border-white/10 text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm shadow-sm">
                        {badge}
                    </span>
                )}

                {/* Vertical Action Stack */}
                <div className={`absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isInWishlist(id)) {
                                removeFromWishlist(id);
                                addToast(`${name} removed from Wishlist`, 'info');
                            } else {
                                addToWishlist({ id, name, price, image: currentImgSrc, size: 'One Size' });
                                addToast(`${name} added to Wishlist!`);
                            }
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors duration-200 ${isInWishlist(id) ? 'bg-coral-500 text-white' : 'bg-black text-white hover:bg-white hover:text-black border border-white/10'}`}
                        title="Add to Wishlist"
                    >
                        <Heart size={18} fill={isInWishlist(id) ? "currentColor" : "none"} />
                    </button>

                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView(props); }}
                        className="w-10 h-10 rounded-full bg-black text-white border border-white/10 shadow-md flex items-center justify-center transition-colors duration-200 hover:bg-white hover:text-black delay-75"
                        title="Quick View"
                    >
                        <Eye size={18} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!props.is_sold_out && badge !== 'Sold Out') {
                                addToCart(props, "One Size");
                                addToast(`${name} added to Bag!`);
                            }
                        }}
                        disabled={!!props.is_sold_out || badge === 'Sold Out'}
                        className={clsx(
                            "w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all duration-200",
                            (props.is_sold_out || badge === 'Sold Out')
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                                : "bg-black text-white border border-white/10 hover:bg-white hover:text-black delay-100"
                        )}
                        title={(props.is_sold_out || badge === 'Sold Out') ? "Sold Out" : "Add to Cart"}
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>

                {/* Slideshow Image Container */}
                <Link href={`/product/${id}`} className="block w-full h-full relative cursor-pointer group/img overflow-hidden">
                    {displayImages.map((img, index) => (
                        <Image
                            key={index}
                            src={getGoogleDriveDirectLink(img)}
                            alt={`${name} - ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className={clsx(
                                "object-cover transition-all duration-700 ease-in-out",
                                index === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-110",
                                isHovered && index === currentImageIndex && "scale-110" // Zoom-in effect on current image
                            )}
                            priority={index === 0}
                        />
                    ))}

                    {/* Hover Overlay Gradient */}
                    <div className={clsx(
                        "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300",
                        isHovered ? "opacity-100" : "opacity-0"
                    )} />
                </Link>
            </div>

            <div className="p-4">
                {brand && <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{brand}</p>}
                <Link href={`/product/${id}`} className="block group-hover:text-coral-500 transition-colors">
                    <h3 className="text-xs md:text-sm font-bold text-navy-900 dark:text-white leading-tight mb-1 md:mb-2 line-clamp-2 h-[2.5em] overflow-hidden" title={name}>{name}</h3>
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

