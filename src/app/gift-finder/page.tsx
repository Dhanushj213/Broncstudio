'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, RotateCcw, Baby, Bike, Backpack, Cake, Heart, Palette, Compass, Armchair, ArrowRight, Sparkles, Star } from 'lucide-react';
import ProductCard from '@/components/Product/ProductCard';
import { getProductImage } from '@/utils/sampleImages';

type QuizState = {
    step: number;
    answers: {
        who?: string;
        occasion?: string;
        vibe?: string;
    }
};

const OPTIONS = {
    who: [
        { id: 'baby', label: 'Newborn / Baby', icon: Baby, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
        { id: 'toddler', label: 'Toddler', icon: Bike, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
        { id: 'kid', label: 'Big Kid', icon: Backpack, color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200' },
    ],
    occasion: [
        { id: 'birthday', label: 'Birthday Bash', icon: Cake, color: 'text-pink-600', bg: 'bg-pink-100', border: 'border-pink-200' },
        { id: 'visit', label: 'Just Visiting', icon: Heart, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
        { id: 'holiday', label: 'Holiday / Festival', icon: Gift, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
    ],
    vibe: [
        { id: 'creative', label: 'Creative & Artsy', icon: Palette, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
        { id: 'active', label: 'Active Explorer', icon: Compass, color: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-200' },
        { id: 'cozy', label: 'Cozy & Chill', icon: Armchair, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' },
    ]
};

export default function GiftFinderPage() {
    const [state, setState] = useState<QuizState>({ step: 1, answers: {} });

    const handleSelect = (category: keyof QuizState['answers'], value: string) => {
        setState(prev => ({
            ...prev,
            answers: { ...prev.answers, [category]: value }
        }));
        setTimeout(() => {
            setState(prev => ({ ...prev, step: prev.step + 1 }));
        }, 400);
    };

    const reset = () => setState({ step: 1, answers: {} });

    return (
        <div className="min-h-screen bg-[#FFF9F2] pt-[var(--header-height)] pb-20 relative overflow-hidden">
            {/* Background Pattern (Confetti) */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#E5E7EB 2px, transparent 2px)',
                backgroundSize: '30px 30px'
            }}></div>

            {/* Decorative Ribbons */}
            <div className="absolute top-0 right-10 w-24 h-48 bg-red-500 rounded-b-full opacity-10 blur-3xl z-0" />
            <div className="absolute bottom-0 left-10 w-32 h-64 bg-amber-400 rounded-t-full opacity-10 blur-3xl z-0" />

            <div className="container-premium max-w-[900px] mx-auto px-6 py-12 relative z-10">

                {/* Header */}
                <div className="text-center mb-16 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 rotate-3 border-4 border-white"
                    >
                        <Gift size={40} className="text-coral-500" />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={state.step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-4xl md:text-6xl font-heading font-bold text-navy-900 leading-tight mb-4"
                        >
                            {state.step === 1 && "Who plays the main character?"}
                            {state.step === 2 && "What are we celebrating?"}
                            {state.step === 3 && "Pick their vibe!"}
                            {state.step === 4 && "🎁 Unwrapped just for them!"}
                        </motion.h1>
                    </AnimatePresence>
                    <p className="text-gray-500 text-lg">Let's find something they'll unwrap with a smile.</p>
                </div>

                {/* Quiz Content */}
                <div className="min-h-[250px]">
                    <AnimatePresence mode="wait">
                        {state.step < 4 ? (
                            <motion.div
                                key={`step-${state.step}`}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                {(state.step === 1 ? OPTIONS.who : state.step === 2 ? OPTIONS.occasion : OPTIONS.vibe).map((opt, idx) => (
                                    <motion.button
                                        key={opt.id}
                                        onClick={() => handleSelect(state.step === 1 ? 'who' : state.step === 2 ? 'occasion' : 'vibe', opt.id)}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`bg-white rounded-3xl p-8 flex flex-col items-center gap-6 text-center shadow-md hover:shadow-xl border-b-4 hover:border-b-8 transition-all duration-200 ${opt.border} border-gray-100`}
                                    >
                                        <div className={`w-28 h-28 rounded-full ${opt.bg} ${opt.color} flex items-center justify-center shadow-inner`}>
                                            <opt.icon size={48} strokeWidth={2} />
                                        </div>
                                        <span className="font-bold text-navy-900 text-xl">{opt.label}</span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-12"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                                    {[1, 2, 3].map((i, idx) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.15 + 0.3 }}
                                        >
                                            <ProductCard
                                                id={`gift-${i}`}
                                                name={`Gift Set ${i}`}
                                                brand="Broncstudio Selection"
                                                price={1299}
                                                image={getProductImage(i)}
                                                badge="Perfect Match"
                                            />
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8"
                                >
                                    <button
                                        onClick={reset}
                                        className="px-8 py-3 text-navy-900 font-bold hover:bg-white hover:shadow-md rounded-full transition-all flex items-center gap-2"
                                    >
                                        <RotateCcw size={18} /> Start Over
                                    </button>
                                    <Link
                                        href="/shop/gifts"
                                        className="px-10 py-4 bg-navy-900 text-white rounded-full font-bold hover:bg-coral-500 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3"
                                    >
                                        <Gift size={20} /> Shop All Gifts
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Progress */}
                {state.step < 4 && (
                    <div className="mt-8 flex flex-col items-center gap-2">
                        <div className="flex gap-2">
                            {[1, 2, 3].map(s => (
                                <div
                                    key={s}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${state.step >= s ? 'bg-coral-500 scale-125' : 'bg-gray-200'}`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step {state.step} of 3</span>
                    </div>
                )}
            </div>
        </div>
    );
}
