'use client';

import React, { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, ChevronDown, ShoppingBag, Zap, Plus, Minus, Heart, MapPin, Check, Star, Info, Share2 } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import StickyActionBar from './StickyActionBar';

interface ProductInfoProps {
    product: any;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const router = useRouter();
    const { formatPrice } = useUI();
    const { addToCart } = useCart();
    const { addToast } = useToast();

    const meta = product.metadata || {};
    const colors = meta.colors || [];
    const sizes = meta.sizes || [];
    const highlights = meta.highlights || [];

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Delivery Check State
    const [pincode, setPincode] = useState('');
    const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');

    // Interactions State
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    const stockStatus = meta.stock_status || 'in_stock';
    const isOutOfStock = stockStatus === 'out_of_stock';
    const isLowStock = stockStatus === 'low_stock';

    const [deliveryDate, setDeliveryDate] = useState<string>('');
    const [codAvailable, setCodAvailable] = useState<boolean>(false);

    const checkPincode = async () => {
        // Indian Pincode Regex: 6 digits, doesn't start with 0
        const pincodeRegex = /^[1-9][0-9]{5}$/;

        if (!pincode || !pincodeRegex.test(pincode)) {
            addToast('Please enter a valid 6-digit Indian Pincode', 'error');
            return;
        }
        setPincodeStatus('checking');
        setDeliveryDate('');
        setCodAvailable(false);

        try {
            const response = await fetch(`/api/pincode?code=${pincode}`);
            const data = await response.json();

            if (data.serviceable) {
                // Calculate Delivery Date (Today + 8 days)
                const date = new Date();
                date.setDate(date.getDate() + 8);
                const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short' };
                const formattedDate = date.toLocaleDateString('en-IN', options);

                setPincodeStatus('available');
                setDeliveryDate(formattedDate);
                setCodAvailable(data.cod_available);

                // Optional: You could show City/State here if desired, e.g.
                // addToast(`Delivery to ${data.city}, ${data.state}`, 'success');
            } else {
                setPincodeStatus('unavailable');
            }
        } catch (error) {
            console.error('Pincode check error:', error);
            setPincodeStatus('unavailable');
            addToast('Unable to verify pincode. Please try again.', 'error');
        }
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        addToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    };

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        if (colors.length > 0 && !selectedColor) {
            addToast('Please select a color', 'error');
            // Optionally scroll to color selector or highlight it
            return;
        }

        if (sizes.length > 0 && !selectedSize) {
            addToast('Please select a size', 'error');
            return;
        }
        addToCart({ ...product, color: selectedColor }, selectedSize);
        addToast(`${quantity} x ${product.name} added to bag`, 'success');
    };

    const handleBuyNow = () => {
        if (isOutOfStock) return;

        if (colors.length > 0 && !selectedColor) {
            addToast('Please select a color', 'error');
            return;
        }

        if (sizes.length > 0 && !selectedSize) {
            addToast('Please select a size', 'error');
            return;
        }
        addToCart({ ...product, color: selectedColor }, selectedSize);
        router.push('/checkout');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out this ${product.name} on Broncstudio!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            addToast('Link copied to clipboard', 'success');
        }
    };

    const incrementQty = () => setQuantity(prev => prev + 1);
    const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="flex flex-col px-6 md:px-0 font-sans text-primary dark:text-white">

            {/* 1. PRODUCT OVERVIEW HEADER */}
            <div className="mb-6 border-b border-divider/50 pb-6 relative dark:border-white/10">
                {/* Share Button (Right Aligned) */}
                <button
                    onClick={handleShare}
                    className="absolute top-0 right-0 p-2 text-secondary hover:text-primary hover:bg-surface-2 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-all"
                    title="Share"
                >
                    <Share2 size={20} strokeWidth={1.5} />
                </button>

                {/* Stock Tag - Only show if Low Stock */}
                {!isOutOfStock && isLowStock && (
                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#111]/60">
                            Low Stock - Fast Selling
                        </span>
                    </div>
                )}

                <div className="mb-1 pr-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#111]/40 dark:text-white/40 block mb-1">Broncstudio</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-[#111] dark:text-white leading-none mb-1">
                        {product.name}
                    </h1>
                    <p className="text-sm text-[#666] dark:text-gray-400 font-medium mb-3">{meta.subtitle || 'Premium Oversized Tee'}</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-3 mb-2">
                    <span className="text-2xl font-bold tracking-tight text-[#111] dark:text-white">{formatPrice(product.price)}</span>
                    {product.compare_at_price && (
                        <>
                            <span className="text-sm text-[#999] dark:text-gray-500 line-through font-medium">{formatPrice(product.compare_at_price)}</span>
                            <span className="text-[10px] font-bold text-[#D00] px-1.5 py-0.5 bg-red-50 dark:bg-red-900/20 rounded uppercase tracking-wider">
                                {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% Off
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* 2. VARIANT SELECTION */}
            <div className="space-y-6 mb-8">
                {/* Colors */}
                {colors.length > 0 && (
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#111] dark:text-white block mb-3">
                            Select Colour
                        </span>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((color: any, i: number) => (
                                <div key={`${color.name}-${i}`} className="group relative">
                                    <button
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${selectedColor === color.name
                                            ? 'ring-1 ring-offset-2 ring-[#111] dark:ring-white dark:ring-offset-black'
                                            : 'hover:scale-105 opacity-90 hover:opacity-100'
                                            }`}
                                        title={color.name}
                                    >
                                        <div className="w-full h-full rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: color.code }} />
                                    </button>
                                    {/* Tooltip */}
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[9px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                        {color.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sizes */}
                {sizes.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-[#111] dark:text-white">
                                Select Size
                            </span>
                            <button
                                onClick={() => setShowSizeGuide(true)}
                                className="text-[10px] font-bold uppercase tracking-wider text-[#666] border-b border-[#CCC] hover:text-[#111] hover:border-[#111] dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:border-white transition-colors pb-0"
                            >
                                Size Guide
                            </button>
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                            {sizes.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`h-11 rounded-[6px] text-xs font-medium transition-all duration-200 ${selectedSize === size
                                        ? 'bg-[#F3F3F3] border-[2px] border-[#111] text-[#111] font-bold dark:bg-white dark:text-black dark:border-white'
                                        : 'bg-white border border-[#DADADA] text-[#111] hover:border-[#111] dark:bg-white/5 dark:border-white/10 dark:text-gray-300 dark:hover:border-white/50'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {selectedSize === 'M' ? (
                            <p className="text-[10px] font-bold text-[#D00] mt-2 animate-pulse uppercase tracking-wide">
                                🔥 Limited Pieces Left
                            </p>
                        ) : !selectedSize ? null : (
                            <p className="text-[10px] font-bold text-[#111]/40 mt-2 uppercase tracking-wide">
                                Selling Fast
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* 3. ACTION SECTION */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex gap-3">
                    {/* Wishlist (Secondary) */}
                    <button
                        onClick={toggleWishlist}
                        className="h-[52px] w-[52px] bg-white border-[1.5px] border-[#111] rounded-[8px] flex items-center justify-center text-[#111] hover:bg-[#F5F5F5] transition-colors active:scale-95 flex-shrink-0 dark:bg-transparent dark:border-white/30 dark:text-white dark:hover:bg-white/10"
                        title="Add to Wishlist"
                    >
                        <Heart
                            size={20}
                            strokeWidth={1.5}
                            fill={isWishlisted ? "currentColor" : "none"}
                            className={`transition-colors ${isWishlisted ? 'text-black dark:text-white' : ''}`}
                        />
                    </button>

                    {/* Main Add to Bag (Primary) */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`h-[52px] flex-1 rounded-[8px] font-bold uppercase tracking-widest text-sm transition-all duration-200 shadow-sm flex items-center justify-center gap-3 ${isOutOfStock
                            ? 'bg-[#E5E5E5] text-[#B5B5B5] cursor-not-allowed border border-[#DADADA] dark:bg-white/10 dark:text-white/30 dark:border-white/5'
                            : 'bg-[#111] text-white hover:bg-[#1C1C1C] hover:-translate-y-0.5 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-100'
                            }`}
                    >
                        {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                    </button>

                    {/* Buy Now (Secondary) */}
                    {!isOutOfStock && (
                        <button
                            onClick={handleBuyNow}
                            className="h-[52px] flex-1 rounded-[8px] font-bold uppercase tracking-widest text-sm transition-all duration-200 shadow-sm border-[2px] border-[#111] bg-white text-[#111] hover:bg-[#F9F9F9] hover:-translate-y-0.5 active:scale-[0.98] dark:bg-black dark:border-white dark:text-white dark:hover:bg-black/80"
                        >
                            Buy Now
                        </button>
                    )}
                </div>

                {/* Security/Trust Highlights - Minimal Card */}
                <div className="bg-[#F9F9F9] rounded-[8px] p-4 flex items-center justify-between text-[10px] font-bold uppercase text-[#666] tracking-wider dark:bg-white/5 dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><Zap size={12} /> Premium Quality</span>
                    <span className="h-3 w-[1px] bg-[#DDD]"></span>
                    <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> Secure Payment</span>
                </div>
            </div>

            {/* 4. DELIVERY CHECK */}
            <div className="mb-8 p-0">
                <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3 text-[#111] dark:text-white">
                    Delivery Details
                </h3>
                <div className="relative border-b border-[#E5E5E5] dark:border-white/10">
                    <input
                        type="text"
                        placeholder="Enter Pincode"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-10 bg-transparent text-sm font-medium text-[#111] dark:text-white focus:outline-none placeholder:text-[#999] dark:placeholder:text-gray-500 placeholder:font-normal"
                    />
                    <button
                        onClick={checkPincode}
                        disabled={!pincode}
                        className="absolute right-0 top-0 h-10 text-[11px] font-bold uppercase tracking-wider text-[#111] dark:text-white hover:underline disabled:opacity-40 transition-all"
                    >
                        Check
                    </button>
                </div>
                {pincodeStatus === 'available' && (
                    <div className="mt-3 flex items-start gap-2 text-[11px] font-bold text-[#111] dark:text-white">
                        <Check size={14} className="mt-0.5 text-green-600 dark:text-green-400" />
                        <div>
                            <p>Estimated Delivery: {deliveryDate}</p>
                            <p className="text-[#666] dark:text-gray-400 font-medium">
                                {codAvailable ? 'COD Available' : 'Prepaid Only'}
                            </p>
                        </div>
                    </div>
                )}
                {pincodeStatus === 'unavailable' && (
                    <p className="mt-2 text-[11px] font-bold text-red-500">
                        Sorry, not available in this area.
                    </p>
                )}
            </div>

            {/* 5. PRODUCT INFORMATION ACCORDIONS */}
            <div className="mb-12">
                <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4 text-[#111] dark:text-white">Product Information</h3>

                <div className="border-t border-[#E5E5E5] dark:border-white/10">
                    <AccordionItem title="Product Details">
                        <div className="py-4 text-sm text-[#444] dark:text-gray-300 leading-relaxed space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-[10px] uppercase text-[#999] dark:text-gray-500 font-bold mb-1">Material</span>
                                    <span className="font-medium text-[#111] dark:text-white">100% Premium Cotton</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase text-[#999] dark:text-gray-500 font-bold mb-1">Fit</span>
                                    <span className="font-medium text-[#111] dark:text-white">Oversized / Relaxed</span>
                                </div>
                            </div>
                        </div>
                    </AccordionItem>

                    <AccordionItem title="Description">
                        <p className="py-4 text-sm text-[#444] dark:text-gray-300 leading-relaxed">
                            {product.description || 'Elevate your everyday style with this premium piece. Crafted for comfort and durability, featuring our signature silhouette.'}
                        </p>
                    </AccordionItem>

                    <AccordionItem title="Material & Care">
                        <div className="py-4 text-sm text-[#444] dark:text-gray-300 leading-relaxed">
                            {meta.material_care || 'Machine wash cold. Do not bleach. Tumble dry low.'}
                        </div>
                    </AccordionItem>
                </div>
            </div>

            {/* Mobile Sticky Bar */}
            <StickyActionBar
                product={product}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                isOutOfStock={isOutOfStock}
            />

            {/* SIZE GUIDE MODAL (Simple Interactions) */}
            <AnimatePresence>
                {showSizeGuide && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSizeGuide(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-surface-1 w-full max-w-md rounded-2xl p-6 shadow-2xl relative"
                        >
                            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Size Guide</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-4 gap-2 text-sm font-bold border-b pb-2">
                                    <span>Size</span>
                                    <span>Chest</span>
                                    <span>Length</span>
                                    <span>Shoulder</span>
                                </div>
                                {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                                    <div key={s} className="grid grid-cols-4 gap-2 text-sm text-secondary">
                                        <span className="font-bold">{s}</span>
                                        <span>38-40</span>
                                        <span>28</span>
                                        <span>18</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowSizeGuide(false)}
                                className="mt-6 w-full h-12 bg-black text-white rounded-lg font-bold uppercase tracking-wider text-xs"
                            >
                                Close Guide
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Subcomponents for cleaner code
function AccordionItem({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-divider/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 group"
            >
                <span className="text-sm font-bold uppercase tracking-wider group-hover:text-primary transition-colors">
                    {title}
                </span>
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TrustBadge({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 text-center p-3 bg-surface-2/50 rounded-xl hover:bg-surface-2 transition-colors">
            <div className="text-primary">{icon}</div>
            <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">{title}</span>
        </div>
    );
}
