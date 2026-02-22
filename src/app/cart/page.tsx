'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';
import { Trash2, Minus, Plus, ArrowRight, ShieldCheck, ShoppingBag, Sparkles, Globe } from 'lucide-react';
import GlassCard from '@/components/UI/GlassCard';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';
import { useStoreSettings } from '@/context/StoreSettingsContext';

const CartPage = () => {
    const [worlds, setWorlds] = useState([
        { name: 'Stationery & Play', subtitle: 'Curiosity & Play.', href: '/shop/kids', image: '' },
        { name: 'Clothing', subtitle: 'Fashion for Everyone.', href: '/shop/clothing', image: '' },
        { name: 'Lifestyle', subtitle: 'Small Joys & Gifting.', href: '/shop/lifestyle', image: '' },
        { name: 'Home & Tech', subtitle: 'Decor & Comfort.', href: '/shop/home', image: '' },
        { name: 'Accessories', subtitle: 'Style Extras.', href: '/shop/accessories', image: '' },
        { name: 'Pets', subtitle: 'Furry Friends.', href: '/shop/pets', image: '' },
    ]);
    const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
    const [loadingTrending, setLoadingTrending] = useState(true);

    const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { settings } = useStoreSettings();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supabase = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );

                // Fetch Collections
                const { data: colData } = await supabase
                    .from('content_blocks')
                    .select('content')
                    .eq('section_id', 'shop_page_collections')
                    .single();

                if (colData && colData.content) {
                    const mappedWorlds = colData.content.map((col: any) => ({
                        name: col.name,
                        subtitle: col.description || '',
                        href: `/shop/${col.slug}`,
                        image: col.image || ''
                    }));
                    setWorlds(mappedWorlds);
                }

                // Fetch Trending Products
                const { data: prodData } = await supabase
                    .from('products')
                    .select('*')
                    .limit(8)
                    .order('created_at', { ascending: false });

                if (prodData) {
                    setTrendingProducts(prodData);
                }
            } catch (error) {
                console.error('Error fetching cart data:', error);
            } finally {
                setLoadingTrending(false);
            }
        };

        fetchData();
    }, []);

    const shipping = cartTotal >= settings.free_shipping_threshold ? 0 : settings.shipping_charge;
    const tax = parseFloat((cartTotal * (settings.tax_rate / 100)).toFixed(2));
    const total = cartTotal + shipping + tax;

    // --- EMPTY STATE VIEW ---
    if (items.length === 0) {
        return (
            <div className="w-full min-h-screen bg-white dark:bg-[#050505] relative overflow-hidden flex flex-col items-center pt-[var(--header-height)]">
                {/* 🎬 Cinematic Background Layers (Dark Mode Only) */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none hidden dark:block">
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-black" />
                    {/* Grain Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />
                    {/* Soft Spotlight */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[150px]" />
                </div>

                <AmbientBackground className="opacity-10 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center justify-center min-h-[75vh] text-center"
                >

                    <div className="mb-14 relative">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                            className="w-24 h-24 mx-auto mb-10 relative"
                        >
                            <div className="absolute inset-0 bg-navy-900/5 dark:bg-white/10 rounded-full blur-2xl animate-pulse" />
                            <div className="relative z-10 w-full h-full flex items-center justify-center border border-navy-900/10 dark:border-white/20 rounded-3xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl">
                                <ShoppingBag className="w-10 h-10 text-navy-900/80 dark:text-white/80 stroke-[1px]" />
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                            className="text-6xl md:text-9xl font-serif font-light text-navy-900 dark:text-white mb-8 tracking-tighter leading-[0.85]"
                        >
                            Your Collection <br /> <span className="italic text-navy-900/40 dark:text-white/60">Awaits.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1.2 }}
                            className="text-navy-900/60 dark:text-neutral-400 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed tracking-wider"
                        >
                            Discover pieces crafted for bold everyday armor.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3, duration: 1 }}
                        className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-lg"
                    >
                        <Link href="/" className="w-full sm:flex-1">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full px-12 py-6 bg-navy-900 dark:bg-white text-white dark:text-black font-bold rounded-full transition-all shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(255,255,255,0.15)] group flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]"
                            >
                                Explore Store
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                        <Link href="/shop" className="w-full sm:flex-1">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full px-12 py-6 bg-transparent border border-navy-900/10 dark:border-white/10 text-navy-900 dark:text-white font-bold rounded-full transition-all flex items-center justify-center text-xs uppercase tracking-[0.2em] hover:bg-navy-900/5 dark:hover:bg-white/5"
                            >
                                New Drops
                            </motion.button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-6"
                    >
                        {[
                            { label: 'Unmatched Quality', icon: <ShieldCheck className="w-4 h-4" /> },
                            { label: 'Everyday Armor', icon: <Sparkles className="w-4 h-4" /> },
                            { label: 'Pan-India Delivery', icon: <Globe className="w-4 h-4" /> }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 hover:text-neutral-400 transition-colors cursor-default">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

            </div>
        );
    }

    // --- STANDARD CART VIEW ---
    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-950 dark:via-purple-900/20 dark:to-pink-900/30 relative overflow-hidden pb-32 md:pb-20 pt-[var(--header-height)]">
            {/* Background Decor */}
            <AmbientBackground className="opacity-80" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl md:text-4xl font-heading font-black text-navy-900 dark:text-white flex items-center gap-4">
                        <ShoppingBag className="w-8 h-8 text-coral-500" />
                        Your Bag
                        <span className="text-lg font-bold text-gray-400 dark:text-navy-400">({items.length} items)</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Cart Items */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        {items.map((item) => (
                            <GlassCard key={`${item.id}-${item.size}`} className="p-4 md:p-6 group relative overflow-hidden">
                                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                                    {/* Image Container */}
                                    <div className="relative w-full sm:w-32 aspect-square rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-neutral-100 dark:bg-white/5" />
                                        )}
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-lg font-bold text-navy-900 dark:text-white truncate pr-6">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-2 text-gray-400 hover:text-coral-500 hover:bg-coral-500/10 rounded-full transition-all active:scale-90"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <p className="text-sm font-bold text-coral-500 mb-3 tracking-widest uppercase">Size: {item.size}</p>
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-full p-1 border border-subtle">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.qty - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-navy-900 dark:hover:text-white transition-colors"
                                                    disabled={item.qty <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-10 text-center font-black text-navy-900 dark:text-white text-sm">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-navy-900 dark:hover:text-white transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <span className="text-lg font-black text-navy-900 dark:text-white">{formatPrice(item.price * item.qty)}</span>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <GlassCard className="p-8 shadow-2xl border-2 border-white/50 dark:border-white/5">
                            <h2 className="text-xl font-black text-navy-900 dark:text-white mb-6 uppercase tracking-widest border-b border-subtle pb-4">Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 font-bold">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 font-bold">
                                    <span>Estimated Tax</span>
                                    <span>{formatPrice(tax)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 font-bold">
                                    <div className="flex flex-col">
                                        <span>Shipping</span>
                                        {shipping === 0 && <span className="text-[10px] text-emerald-500 uppercase tracking-widest">Free Shipping</span>}
                                    </div>
                                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                                </div>
                                <div className="pt-4 border-t border-subtle">
                                    <div className="flex justify-between text-xl font-black text-navy-900 dark:text-white">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <button className="w-full bg-navy-900 dark:bg-white text-white dark:text-navy-900 font-black py-4 rounded-full text-lg uppercase tracking-widest hover:bg-coral-500 dark:hover:bg-coral-500 dark:hover:text-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 group flex items-center justify-center gap-3">
                                    Checkout
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>

                            <div className="mt-8 flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span>Secure SSL Encryption</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                                    <Sparkles className="w-4 h-4 text-coral-500" />
                                    <span>7-Day Easy Returns</span>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CartPage;
