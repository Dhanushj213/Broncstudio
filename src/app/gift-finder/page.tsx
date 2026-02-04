'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, RotateCcw, Palette, Loader2 } from 'lucide-react';
import ProductCard from '@/components/Product/ProductCard';
import { GIFT_MOMENTS, AUDIENCE_OPTIONS, BUDGET_OPTIONS, getMomentById } from '@/data/giftMoments';

interface Product {
    id: string;
    name: string;
    price: number;
    images?: string[];
    metadata?: {
        why_gift?: string;
    };
}

export default function GiftFinderPage() {
    const [selectedMoment, setSelectedMoment] = useState<string | null>(null);
    const [audience, setAudience] = useState<string | null>(null);
    const [budget, setBudget] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch products when filters change
    useEffect(() => {
        if (!selectedMoment) return;

        const fetchGifts = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/gift-finder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        moment: selectedMoment,
                        audience: audience || undefined,
                        budget: budget || undefined,
                    }),
                });
                const data = await res.json();
                setProducts(data.products || []);
            } catch (err) {
                console.error('Failed to fetch gifts:', err);
                setProducts([]);
            }
            setLoading(false);
        };

        fetchGifts();
    }, [selectedMoment, audience, budget]);

    const reset = () => {
        setSelectedMoment(null);
        setAudience(null);
        setBudget(null);
        setProducts([]);
    };

    const currentMoment = selectedMoment ? getMomentById(selectedMoment) : null;

    // Dynamic helper text
    const getHelperText = () => {
        const parts: string[] = [];
        if (currentMoment) parts.push(currentMoment.label.toLowerCase());
        if (audience) {
            const aud = AUDIENCE_OPTIONS.find(a => a.id === audience);
            if (aud) parts.push(aud.label.toLowerCase());
        }
        if (budget) {
            const bud = BUDGET_OPTIONS.find(b => b.id === budget);
            if (bud) parts.push(bud.label.toLowerCase());
        }
        return parts.length > 0 ? `Based on ${parts.join(', ')}.` : '';
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFF9F2] to-white pt-[var(--header-height)] pb-20">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#E5E7EB 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
            }}></div>

            <div className="container-premium max-w-[1100px] mx-auto px-4 md:px-6 py-8 md:py-12 relative z-10">

                {/* ===== HEADER ===== */}
                <div className="text-center mb-10 md:mb-14">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-white rounded-2xl shadow-xl flex items-center justify-center mb-5 rotate-3 border-4 border-white"
                    >
                        <Gift size={36} className="text-coral-500" />
                    </motion.div>
                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-navy-900 leading-tight mb-3">
                        Find the Perfect Gift
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
                        Tell us the moment — we'll help you find something they'll love.
                    </p>
                </div>

                {/* ===== MOMENT SELECTION ===== */}
                {!selectedMoment && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h2 className="text-lg font-bold text-navy-900 mb-6 text-center md:text-left uppercase tracking-widest text-xs opacity-70">
                            Choose a moment
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {GIFT_MOMENTS.map((moment, idx) => (
                                <motion.button
                                    key={moment.id}
                                    onClick={() => setSelectedMoment(moment.id)}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-left shadow-sm hover:shadow-xl border border-gray-100 hover:border-navy-900 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110">
                                        <moment.icon size={64} strokeWidth={1} />
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-navy-900 group-hover:text-white transition-colors duration-300">
                                        <moment.icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-bold text-navy-900 text-sm md:text-base mb-2 group-hover:text-navy-900 transition-colors">
                                        {moment.label}
                                    </h3>
                                    <p className="text-gray-400 text-xs leading-relaxed group-hover:text-gray-500">
                                        {moment.tagline}
                                    </p>
                                </motion.button>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* ===== REFINEMENT BAR ===== */}
                {selectedMoment && currentMoment && (
                    <motion.section
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100">
                            {/* Selected Moment */}
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-12 h-12 rounded-full bg-navy-50 text-navy-900 flex items-center justify-center">
                                    <currentMoment.icon size={24} strokeWidth={1.5} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-navy-900 text-lg leading-none mb-1">{currentMoment.label}</p>
                                    <button onClick={reset} className="text-coral-500 text-xs font-bold hover:underline flex items-center gap-1 uppercase tracking-wider">
                                        <RotateCcw size={10} /> Change moment
                                    </button>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-3">
                                {/* Audience */}
                                <div className="flex gap-2">
                                    {AUDIENCE_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setAudience(audience === opt.id ? null : opt.id)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${audience === opt.id
                                                ? 'bg-navy-900 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="w-px h-6 bg-gray-200 hidden md:block" />

                                {/* Budget */}
                                <div className="flex gap-2">
                                    {BUDGET_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setBudget(budget === opt.id ? null : opt.id)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${budget === opt.id
                                                ? 'bg-coral-500 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* ===== RESULTS SECTION ===== */}
                {selectedMoment && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="mb-6">
                            <h2 className="text-xl md:text-2xl font-heading font-bold text-navy-900 mb-1">
                                Gift ideas for this moment
                            </h2>
                            <p className="text-gray-500 text-sm">{getHelperText()}</p>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 size={40} className="animate-spin text-coral-500" />
                                <span className="ml-3 text-gray-500 font-medium">Finding perfect gifts...</span>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                <Gift size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500 font-medium mb-2">No gifts found for these filters</p>
                                <p className="text-gray-400 text-sm">Try adjusting the audience or budget</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {products.map((product, idx) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <ProductCard
                                            id={product.id}
                                            name={product.name}
                                            brand="BroncStudio"
                                            price={product.price}
                                            image={product.images?.[0] || '/images/placeholder.jpg'}
                                        />
                                        {product.metadata?.why_gift && (
                                            <p className="text-xs text-gray-400 mt-2 px-1 italic">
                                                "{product.metadata.why_gift}"
                                            </p>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.section>
                )}

                {/* ===== PERSONALISATION CTA ===== */}
                {selectedMoment && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 pt-10 border-t border-gray-200"
                    >
                        <div className="text-center max-w-lg mx-auto">
                            <h3 className="text-xl md:text-2xl font-heading font-bold text-navy-900 mb-3">
                                ✨ Want to make it truly yours?
                            </h3>
                            <p className="text-gray-500 text-sm md:text-base mb-6">
                                You can personalise our products by printing your own image or design on selected items like tops, bottles, keychains, fridge magnets, and more.
                            </p>
                            <Link
                                href="/personalise"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-coral-500 to-pink-500 text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                            >
                                <Palette size={20} />
                                Personalise a Product
                            </Link>
                        </div>
                    </motion.section>
                )}

                {/* ===== EMPTY STATE ===== */}
                {!selectedMoment && (
                    <p className="text-center text-gray-400 text-sm mt-8">
                        Select a moment above to see gift ideas.
                    </p>
                )}
            </div>
        </div>
    );
}
