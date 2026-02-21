'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { getRecommendations } from '@/lib/recommendations';
import { formatPrice } from '@/utils/formatPrice';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

interface ShopTheLookProps {
    product: any;
}

export default function ShopTheLook({ product }: ShopTheLookProps) {
    const { addToCart } = useCart();
    const { addToast } = useToast();

    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLooks = async () => {
            if (!product) return;
            setLoading(true);
            const recs = await getRecommendations(product);
            const limitedRecs = recs.slice(0, 3);
            setRecommendations(limitedRecs);

            // Default: Select all recommendations
            const initialSelected = new Set([product.id, ...limitedRecs.map((r: any) => r.id)]);
            setSelectedIds(initialSelected);

            setLoading(false);
        };
        fetchLooks();
    }, [product]);

    if (loading) return null;
    if (recommendations.length === 0) return null;

    const allItems = [product, ...recommendations];

    const toggleSelection = (id: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const selectedItems = allItems.filter(item => selectedIds.has(item.id));
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
    const totalItems = selectedItems.length;

    const handleAddBundle = () => {
        if (totalItems === 0) {
            addToast('Please select at least one item to add.', 'error');
            return;
        }

        selectedItems.forEach(item => {
            const size = item.metadata?.sizes?.[0] || 'One Size';
            addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.images?.[0] || item.image || '',
                qty: 1,
                size: size,
                color: item.metadata?.colors?.[0]?.name || 'Default'
            }, size);
        });
        addToast(`Found your style! ${totalItems} items added to bag.`, 'success');
    };

    return (
        <section className="py-24 md:py-32 bg-white dark:bg-[#050505] relative overflow-hidden">
            {/* Ambient Background Accents */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-coral-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 -right-24 w-64 h-64 bg-navy-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="container-premium max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
                {/* Header Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                    >
                        <span className="text-coral-500 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 block">Editorial Curation</span>
                        <h2 className="text-4xl md:text-7xl font-heading font-black text-navy-900 dark:text-white leading-[0.9] tracking-tight">
                            Shop <br className="hidden md:block" /> The Look.
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
                        className="lg:max-w-md"
                    >
                        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            Handpicked essentials that pair perfectly with your {product.name.toLowerCase()}. Curated for visual excellence.
                        </p>
                    </motion.div>
                </div>

                <div className="flex flex-col xl:flex-row gap-12 xl:gap-20 items-start">

                    {/* The Lookbook Grid */}
                    <div className="flex-1 w-full overflow-visible">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {allItems.map((item, index) => {
                                const isSelected = selectedIds.has(item.id);
                                const isMain = item.id === product.id;

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.15 }}
                                        className={`group relative flex flex-col ${index % 2 !== 0 ? 'md:mt-12' : ''}`}
                                    >
                                        {/* Product Card Container */}
                                        <div
                                            onClick={() => toggleSelection(item.id)}
                                            className={`relative aspect-[4/5] rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-700 ease-in-out border-2 ${isSelected
                                                ? 'border-navy-900 dark:border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]'
                                                : 'border-transparent opacity-60 grayscale-[0.4] scale-95 hover:opacity-80 hover:scale-98'
                                                }`}
                                        >
                                            <Image
                                                src={getGoogleDriveDirectLink(item.images?.[0] || item.image || '/images/placeholder.jpg')}
                                                alt={item.name}
                                                fill
                                                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            {/* Interactive Tags */}
                                            <div className="absolute inset-0 flex flex-col justify-between p-6">
                                                <div className="flex justify-between items-start">
                                                    {isMain ? (
                                                        <span className="bg-white/90 dark:bg-black/90 backdrop-blur-xl text-navy-900 dark:text-white text-[9px] font-black tracking-[0.2em] px-3 py-1.5 rounded-full uppercase shadow-xl ring-1 ring-black/5">
                                                            Focus Item
                                                        </span>
                                                    ) : <div />}

                                                    {/* Custom Checkbox Tag */}
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ring-2 ${isSelected
                                                            ? 'bg-coral-500 text-white ring-white/20 scale-100'
                                                            : 'bg-white/10 backdrop-blur-md text-transparent ring-white/10 scale-90'
                                                            }`}
                                                    >
                                                        <Check size={18} strokeWidth={4} />
                                                    </div>
                                                </div>

                                                {/* Price Tag (Appears on Hover) */}
                                                <motion.div
                                                    animate={{ opacity: isSelected ? 1 : 0, y: isSelected ? 0 : 10 }}
                                                    className="inline-flex self-start bg-white/90 dark:bg-white backdrop-blur-xl text-black px-4 py-2 rounded-xl text-sm font-black shadow-2xl ring-1 ring-black/5"
                                                >
                                                    {formatPrice(item.price)}
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Product Info Below */}
                                        <div className="mt-6">
                                            <Link href={`/product/${item.id}`} className="block">
                                                <h3 className={`text-sm md:text-base font-bold leading-tight transition-all duration-300 ${isSelected ? 'text-navy-900 dark:text-white' : 'text-gray-400'}`}>
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <div className={`text-xs font-bold uppercase tracking-widest mt-2 transition-all duration-300 ${isSelected ? 'text-coral-500' : 'text-gray-400'}`}>
                                                {item.brand || 'Premium Design'}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* The Checkout Panel (Sticky) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-full xl:w-[420px] shrink-0 sticky top-32 z-30"
                    >
                        <div className="relative group">
                            {/* Decorative Edge Glow */}
                            <div className="absolute -inset-[1px] bg-gradient-to-tr from-coral-500 via-navy-500 to-purple-500 rounded-[2.5rem] opacity-20 blur-sm transition duration-1000 group-hover:opacity-40" />

                            <div className="relative bg-white dark:bg-[#0A0A0A] p-10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/5">
                                <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100 dark:border-white/5">
                                    <h3 className="font-heading font-black text-2xl text-navy-900 dark:text-white tracking-tight">Your Look</h3>
                                    <div className="flex -space-x-3">
                                        {selectedItems.slice(0, 3).map((item, i) => (
                                            <div key={item.id} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0A0A0A] overflow-hidden bg-gray-100">
                                                <Image src={getGoogleDriveDirectLink(item.images?.[0] || item.image || '/images/placeholder.jpg')} alt="" width={40} height={40} className="object-cover h-full w-full" />
                                            </div>
                                        ))}
                                        {totalItems > 3 && (
                                            <div className="w-10 h-10 rounded-full bg-navy-900 dark:bg-white text-white dark:text-navy-900 text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-[#0A0A0A]">
                                                +{totalItems - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Dynamic Price & Savings */}
                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Set Value</span>
                                            <motion.span
                                                key={totalPrice}
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="text-4xl md:text-5xl font-black text-navy-900 dark:text-white tracking-tighter"
                                            >
                                                {formatPrice(totalPrice)}
                                            </motion.span>
                                        </div>
                                    </div>

                                    {totalItems > 1 && (
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 py-3 px-4 rounded-2xl text-sm border border-green-100 dark:border-green-900/30">
                                            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                            Style Bundle Discount Applied
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleAddBundle}
                                    disabled={totalItems === 0}
                                    className={`group/btn w-full py-6 font-black rounded-3xl flex items-center justify-center gap-3 transition-all duration-500 overflow-hidden relative shadow-2xl active:scale-[0.98] ${totalItems > 0
                                        ? 'bg-navy-900 dark:bg-white text-white dark:text-black hover:bg-coral-500 dark:hover:bg-coral-400'
                                        : 'bg-gray-100 dark:bg-[#111] text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <ShoppingBag size={22} className="transition-transform group-hover/btn:-translate-y-1" />
                                    <span className="tracking-wide">
                                        {totalItems > 0 ? `ADD ${totalItems} PIECES TO BAG` : 'BUILD YOUR LOOK'}
                                    </span>
                                </button>

                                <div className="mt-8 text-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">
                                        Free Express Shipping Included
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
