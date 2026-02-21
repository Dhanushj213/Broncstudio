'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import CommerceCountdown from '@/components/UI/CommerceCountdown';
import { ShoppingBag, Heart, Minus, Plus, Info, HelpCircle, ThumbsUp, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { createClient } from '@/utils/supabase/client';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

interface LimitedDropProps {
    data: {
        is_enabled: boolean;
        product_id?: string;
        start_date: string;
        end_date: string;
        total_quantity: number;
        remaining_quantity: number;
        show_tape: boolean;
        show_countdown: boolean;
        waitlist_enabled: boolean;
        stock_message?: string;
        override_name?: string;
        override_price?: number;
        override_mrp?: number;
        override_image?: string;
        marquee_text?: string;
        available_sizes?: string;
        info_box_text?: string;
        more_info_text?: string;
        gallery_images?: string[];
        size_chart_url?: string;
    };
}



export default function LimitedDropSection({ data }: LimitedDropProps) {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToast } = useToast();

    const [quantity, setQuantity] = useState(1);
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);

    useEffect(() => {
        if (!data.end_date) return;
        const checkEnded = () => {
            setHasEnded(new Date() > new Date(data.end_date));
        };
        checkEnded();
        const timer = setInterval(checkEnded, 1000);
        return () => clearInterval(timer);
    }, [data.end_date]);

    // Derived explicitly from admin dashboard configuration as requested
    const actualRemaining = data.remaining_quantity ?? (data.total_quantity - ((data as any).sold_parts || 0));
    const stats = {
        remaining: hasEnded ? 0 : actualRemaining,
        total: data.total_quantity || 1
    };

    const isOutOfStock = stats.remaining <= 0;
    const isCriticalStock = stats.remaining > 0 && stats.remaining < 5;
    const showStockAlert = stats.remaining > 0 && stats.remaining <= 20;


    // Parse sizes from CSV or use defaults
    const sizes = useMemo(() => {
        if (!data.available_sizes) return ['S', 'M', 'L', 'XL', '2XL', '3XL'];
        return data.available_sizes.split(',').map(s => s.trim()).filter(Boolean);
    }, [data.available_sizes]);

    const [selectedSize, setSelectedSize] = useState(sizes[0] || 'S');

    const productForInteractions = {
        id: data.product_id || 'limited-drop-product',
        name: data.override_name || 'Limited Edition Product',
        price: data.override_price || 0,
        image: getGoogleDriveDirectLink(data.override_image) || '/images/placeholder.jpg',
        gallery_images: data.gallery_images || [],
        metadata: {
            mrp: data.override_mrp,
            is_limited_drop: true
        }
    };

    const isWishlisted = isInWishlist(productForInteractions.id);

    const allImages = useMemo(() => [data.override_image, ...(data.gallery_images || [])].filter(Boolean).map(getGoogleDriveDirectLink) as string[], [data.override_image, data.gallery_images]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 1.1
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1.03
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 1
        })
    };

    const paginate = (newDirection: number) => {
        const nextIndex = (currentImageIndex + newDirection + allImages.length) % allImages.length;
        setDirection(newDirection);
        setCurrentImageIndex(nextIndex);
    };

    // Auto-scroll functionality
    useEffect(() => {
        if (allImages.length <= 1) return;

        const autoScrollInterval = setInterval(() => {
            paginate(1);
        }, 4500); // 4.5 seconds per slide

        return () => clearInterval(autoScrollInterval);
    }, [currentImageIndex, allImages.length]);

    const handleAddToCart = () => {
        if (isOutOfStock) {
            addToast('Sorry, this item is out of stock', 'error');
            return;
        }
        if (!selectedSize) {
            addToast('Please select a size first', 'error');
            return;
        }
        if (quantity > stats.remaining) {
            addToast(`Only ${stats.remaining} items left in stock`, 'error');
            return;
        }
        addToCart(productForInteractions, selectedSize, quantity);
        addToast(`${quantity}x ${productForInteractions.name} (Size: ${selectedSize}) added to bag`, 'success');
    };

    const handleToggleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(productForInteractions.id);
            addToast('Removed from wishlist', 'info');
        } else {
            addToWishlist({
                id: productForInteractions.id,
                name: productForInteractions.name,
                price: productForInteractions.price,
                image: productForInteractions.image,
                size: selectedSize
            });
            addToast('Added to wishlist', 'success');
        }
    };

    if (!data.is_enabled) return null;

    return (
        <section className="relative w-full bg-[#0A0B0E] py-12 md:py-20 px-4 md:px-6 overflow-hidden transition-colors duration-700 font-sans selection:bg-[#f1a333]/30">
            {/* 1. Cinematic Backdrop Layer */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Deep Charcoal Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0B0E] via-[#121318] to-[#0A0B0E]" />

                {/* Film Grain / Noise Overlay */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* Luxe Radial Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#f1a333]/5 blur-[140px] rounded-full" />

                {/* Soft Moving Fog Layer */}
                <motion.div
                    animate={{
                        x: [-20, 20, -20],
                        y: [-10, 10, -10],
                        opacity: [0.03, 0.07, 0.03]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 blur-3xl"
                />

                {/* Faint Floating Particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
                        animate={{
                            y: ["-10%", "110%"],
                            opacity: [0, 0.1, 0]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 20,
                            repeat: Infinity,
                            delay: Math.random() * 10,
                            ease: "linear"
                        }}
                        className="absolute w-1 h-1 bg-white/40 rounded-full blur-[1px]"
                    />
                ))}
            </div>

            {/* 1. TOP YELLOW TAPE (Admin-Controlled Content) */}
            {data.show_tape && (
                <div className="absolute top-0 left-0 right-0 z-30 overflow-hidden bg-[#F6F32D] h-11 flex items-center shadow-sm">
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{ x: [0, "-50%"] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                        {[...Array(2)].map((_, idx) => (
                            <div key={idx} className="flex items-center gap-12 pr-12">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-12">
                                        <span className="text-[14px] font-black text-black uppercase tracking-tight">
                                            {data.marquee_text || "LIMITED EDITION DROP"}
                                        </span>
                                        <span className="text-black/30 font-black">•</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </div>
            )}

            {/* Restored Edition Title Below Top Tape */}
            <div className="absolute top-14 left-0 w-full flex justify-center sm:block sm:w-auto sm:left-8 z-30 pointer-events-none origin-top-left">
                <h3 className="text-[7vw] sm:text-[60px] md:text-[120px] whitespace-nowrap font-serif italic text-white/5 uppercase tracking-tighter leading-none select-none mix-blend-overlay transform sm:scale-100 pr-4 sm:pr-0">
                    LIMITED EDITION /{stats.total.toString().padStart(2, '0')}
                </h3>
            </div>

            <div className="max-w-[1440px] mx-auto pt-16 md:pt-24 pb-12 relative z-10 px-4 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start relative">
                    {/* LEFT: Cinematic Hero Frame */}
                    <div className="relative group perspective-1000">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative aspect-[3/4] overflow-hidden rounded-[2px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)]"
                        >
                            {/* Cinematic Horizontal Scroll Slider */}
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.div
                                    key={currentImageIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.5 },
                                        scale: { duration: 0.8, ease: "easeOut" }
                                    }}
                                    className="absolute inset-0 w-full h-full"
                                >
                                    <Image
                                        src={allImages[currentImageIndex] || '/images/placeholder.jpg'}
                                        alt={data.override_name || 'Limited Drop'}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className={`object-cover transition-opacity duration-1000 ${isOutOfStock ? 'opacity-40 grayscale-[0.8]' : 'opacity-100'}`}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Red Sold Out Stamp - Restricted to Image */}
                            {isOutOfStock && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 2, rotate: -20 }}
                                    animate={{ opacity: 1, scale: 1, rotate: -12 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                                    className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none mix-blend-screen"
                                >
                                    <div className="border-[4px] sm:border-[6px] border-[#ff3333] px-8 sm:px-12 py-3 sm:py-6 rounded-xl bg-[#ff3333]/10 backdrop-blur-sm shadow-[0_0_100px_rgba(255,51,51,0.4)]">
                                        <h2 className="text-[#ff3333] text-4xl sm:text-7xl font-black uppercase tracking-[0.2em] font-sans drop-shadow-[0_0_15px_rgba(255,51,51,0.8)] m-0 leading-none">
                                            SOLD OUT
                                        </h2>
                                    </div>
                                </motion.div>
                            )}

                            {/* Gallery Navigation Dots */}
                            {allImages.length > 1 && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                                    {allImages.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setDirection(i > currentImageIndex ? 1 : -1);
                                                setCurrentImageIndex(i);
                                            }}
                                            className={`h-1 transition-all duration-300 rounded-full ${currentImageIndex === i ? 'w-8 bg-[#f1a333]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Luxury Textures & Vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-transparent to-transparent opacity-80" />
                            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] pointer-events-none" />

                            {/* Film Grain Texture for Image */}
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                            />

                            {/* Status Overlay Removed as per request */}
                        </motion.div>

                        {/* EXCLUSIVE THUMBNAIL PREVIEW ROW */}
                        {allImages.length > 1 && (
                            <div className="mt-8 flex gap-4 items-center justify-center lg:justify-start overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                                {allImages.map((img, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setDirection(idx > currentImageIndex ? 1 : -1);
                                            setCurrentImageIndex(idx);
                                        }}
                                        className={`relative flex-shrink-0 w-20 h-24 rounded-[1px] overflow-hidden border transition-all duration-500 ${currentImageIndex === idx
                                            ? 'border-[#f1a333] shadow-[0_10px_20px_-5px_rgba(241,163,51,0.3)]'
                                            : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'
                                            }`}
                                    >
                                        <Image src={img} alt={`Preview ${idx + 1}`} fill sizes="80px" className="object-cover" />
                                        {currentImageIndex === idx && (
                                            <motion.div
                                                layoutId="active-thumb-overlay"
                                                className="absolute inset-0 bg-[#f1a333]/10"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: High-Status Product Details */}
                    <div className="flex flex-col space-y-10 lg:space-y-12 pt-4">

                        {/* 1. Monumental Title Section */}
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="text-[11px] font-black uppercase tracking-[0.6em] text-[#f1a333]/70"
                                >
                                    BRONC X AG-01
                                </motion.span>
                                <div className="relative">
                                    <motion.h1
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        className="text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white uppercase tracking-[0.1em] sm:tracking-[0.15em] leading-[1.1]"
                                        style={{ fontFamily: 'var(--font-playfair), serif' }}
                                    >
                                        {(data.override_name || "VOID").split("'").map((part, i) => (
                                            <span key={i} className={part.toUpperCase() === 'VOID' ? 'text-[#f1a333] dark:text-[#f1a333]' : ''}>
                                                {i > 0 ? `'${part}'` : part}
                                            </span>
                                        ))}
                                    </motion.h1>
                                    {/* Faint Underline Glow Animation */}
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="absolute -bottom-4 left-0 w-40 h-px bg-gradient-to-r from-[#f1a333] to-transparent shadow-[0_0_15px_rgba(241,163,51,0.5)]"
                                    />
                                </div>
                            </div>

                            {/* Poetic Emotional Description Removed as per request */}
                        </div>

                        {/* 2. Advanced Urgency & Countdown */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
                                    {isOutOfStock ? "Drop Concluded" : "Drop Ends In"}
                                </span>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2px] shadow-2xl flex items-center justify-center min-h-[100px]">
                                {isOutOfStock ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-2xl md:text-3xl font-black text-red-500 uppercase tracking-[0.3em]">
                                            Sold Out
                                        </span>
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Successful Drop</span>
                                    </div>
                                ) : (
                                    data.show_countdown && <CommerceCountdown targetDate={data.end_date} />
                                )}
                            </div>
                        </div>

                        {/* 3. Psychological Pricing Area */}
                        <div className="flex flex-col items-start gap-1 py-8 border-y border-white/5">
                            <div className="flex items-baseline gap-4">
                                {data.override_mrp && (
                                    <span className="text-xl md:text-2xl font-light text-white/20 line-through tracking-tighter decoration-white/10">
                                        ₹{data.override_mrp.toLocaleString()}
                                    </span>
                                )}
                                <span className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                                    ₹{(data.override_price || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <AlertCircle size={10} className="text-[#f1a333]" />
                                <span className="text-[10px] font-black text-[#f1a333] uppercase tracking-[0.4em]">
                                    Limited Drop – No Restock
                                </span>
                            </div>
                        </div>

                        {/* 4. FOMO & Scarcity Engineering */}
                        <div className="space-y-8 pt-2">
                            {/* Scarcity Bar Design */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Stock Status</span>
                                    <motion.span
                                        animate={stats.remaining < 5 ? { opacity: [1, 0.5, 1], scale: [1, 1.05, 1] } : {}}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className={`text-[11px] font-black uppercase tracking-widest ${stats.remaining < 5 ? 'text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-white/60'}`}
                                    >
                                        {isOutOfStock ? "SOLD OUT" : `${stats.remaining} PIECES REMAINING`}
                                    </motion.span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(stats.remaining / stats.total) * 100}%` }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        className={`h-full relative transition-colors duration-1000 ${stats.remaining < 5 ? 'bg-red-600' : 'bg-[#f1a333]/60'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Luxury Size Selection (Glass + Matte Hybrid) */}
                        <div className="space-y-4 sm:space-y-6 pt-4">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Select Silhouette</span>
                                <button
                                    onClick={() => setShowSizeChart(true)}
                                    className="text-[10px] font-bold text-[#f1a333] uppercase tracking-widest cursor-pointer underline underline-offset-4 decoration-[#f1a333]/30 hover:text-white transition-colors"
                                >
                                    Size Guide
                                </button>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                                {sizes.map(size => (
                                    <motion.button
                                        key={size}
                                        whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.15)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-12 sm:h-16 rounded-[2px] border text-[12px] sm:text-[13px] font-black transition-all duration-500 font-serif ${selectedSize === size
                                            ? 'bg-[#f1a333] text-black border-[#f1a333] shadow-[0_15px_30px_-10px_rgba(241,163,51,0.5)]'
                                            : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20 shadow-xl shadow-black/40'
                                            }`}
                                    >
                                        {size}
                                    </motion.button>
                                ))}
                            </div>
                            {/* Model Info Text Removed as per request */}
                        </div>

                        {/* 6. Powerful Action Bar */}
                        <div className="pt-6 sm:pt-8 space-y-6">
                            <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row">
                                <div className="flex items-center justify-between lg:justify-start h-14 sm:h-16 px-4 sm:px-6 bg-white/5 border border-white/10 rounded-[2px] shadow-inner lg:w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center text-white/20 hover:text-[#f1a333] transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-10 sm:w-12 text-center text-sm font-black text-white selection:bg-none">
                                        {quantity.toString().padStart(2, '0')}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center text-white/20 hover:text-[#f1a333] transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="flex gap-3 sm:gap-4 flex-1">
                                    <motion.button
                                        whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
                                        whileTap={{ scale: 0.98 }}
                                        animate={stats.remaining < 2 && !isOutOfStock ? {
                                            x: [0, -2, 2, -2, 2, 0],
                                        } : {}}
                                        transition={stats.remaining < 2 ? {
                                            duration: 0.5,
                                            repeat: Infinity,
                                            repeatDelay: 3
                                        } : {}}
                                        onClick={handleAddToCart}
                                        disabled={isOutOfStock}
                                        className="flex-1 h-14 sm:h-16 bg-white text-black text-[11px] sm:text-[13px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] flex items-center justify-center gap-2 sm:gap-4 rounded-[2px] shadow-[0_20px_40px_-5px_rgba(255,255,255,0.1)] transition-all duration-300 disabled:opacity-30 disabled:grayscale group relative overflow-hidden px-2"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f1a333]/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                        <span className="relative z-10 text-center">{isOutOfStock ? "EXHAUSTED" : "SECURE YOUR PIECE"}</span>
                                        {!isOutOfStock && <ShoppingBag size={16} className="relative z-10 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" />}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleToggleWishlist}
                                        className={`w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center border rounded-[2px] transition-all duration-500 ${isWishlisted
                                            ? 'bg-red-500/10 border-red-500/40 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                                            : 'bg-white/5 border-white/5 text-white/20 hover:border-white/20 hover:text-white'
                                            }`}
                                    >
                                        <Heart size={20} className="sm:w-6 sm:h-6" fill={isWishlisted ? "currentColor" : "none"} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* More Info Feature */}
                        {(data.more_info_text || data.info_box_text) && (
                            <div className="pt-2">
                                <button
                                    onClick={() => setShowMoreInfo(!showMoreInfo)}
                                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-[#f1a333] transition-colors"
                                >
                                    <Info size={14} />
                                    {showMoreInfo ? "Hide Information" : (data.more_info_text || "More Information")}
                                    <motion.div
                                        animate={{ rotate: showMoreInfo ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Plus size={10} className={showMoreInfo ? "hidden" : "block"} />
                                        <Minus size={10} className={showMoreInfo ? "block" : "hidden"} />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {showMoreInfo && data.info_box_text && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 p-5 bg-gray-50 dark:bg-white/5 rounded-[4px] border border-gray-100 dark:border-white/10">
                                                <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-300 font-medium whitespace-pre-line">
                                                    {data.info_box_text}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. BOTTOM PINK TAPE (Admin-Controlled Content - Reversed) */}
            {data.show_tape && (
                <div className="absolute bottom-0 left-0 right-0 z-30 overflow-hidden bg-[#F1D1E1] h-12 flex items-center border-t border-black/5">
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{ x: ["-50%", 0] }} // Reverse direction
                        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    >
                        {[...Array(2)].map((_, idx) => (
                            <div key={idx} className="flex items-center gap-12 pr-12">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-12">
                                        <span className="text-[14px] font-black text-black uppercase tracking-tight italic">
                                            {data.marquee_text || "LIMITED EDITION DROP"}
                                        </span>
                                        <span className="text-black/30 font-black">•</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </div>
            )}

            {/* Size Chart Modal */}
            <AnimatePresence>
                {showSizeChart && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSizeChart(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-[#121318] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <h3 className="text-xl font-serif text-white uppercase tracking-widest">Size Specification</h3>
                                <button
                                    onClick={() => setShowSizeChart(false)}
                                    className="p-2 text-white/40 hover:text-white transition-colors"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>
                            <div className="p-4 md:p-8 max-h-[70vh] overflow-y-auto">
                                {data.size_chart_url ? (
                                    <div className="relative w-full aspect-[3/4]">
                                        <Image
                                            src={getGoogleDriveDirectLink(data.size_chart_url)}
                                            alt="Size Chart"
                                            fill
                                            className="object-contain rounded-lg shadow-2xl"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-white/20">
                                        <HelpCircle size={48} className="mb-4" />
                                        <p className="text-sm font-bold uppercase tracking-widest">Size chart not available for this item</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 bg-white/5 border-t border-white/5 text-center">
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">
                                    All measurements are in inches unless specified otherwise.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}

function SignatureIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 60 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
            <path d="M5 10c5-5 10 5 15 0s10-5 15 0 10 5 15 0" className="opacity-40" />
            <text x="10" y="14" className="text-[10px] font-cursive italic fill-current">mhg</text>
        </svg>
    );
}
