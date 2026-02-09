'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AmbientBackground from '@/components/UI/AmbientBackground';
import GlassCard from '@/components/UI/GlassCard';
import { Sparkles, Gift, Coffee, Home, Rocket, ChevronRight, Heart, ArrowRight } from 'lucide-react';

export default function CuratedPage() {
    return (
        <main className="relative min-h-screen pt-[var(--header-height)] pb-24 bg-[#FFF9F2] dark:bg-black overflow-hidden">
            <AmbientBackground />

            {/* Header */}
            <div className="relative z-10 container-premium max-w-[1200px] mx-auto px-6 py-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-coral-500/10 text-coral-500 font-bold text-xs uppercase tracking-widest border border-coral-500/20">
                        <Sparkles size={12} />
                        <span>Curated Selections</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-navy-900 dark:text-white mb-6 leading-tight">
                        Find the <span className="text-coral-500">Perfect Gift</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Thoughtfully chosen collections for every occasion. Unwrap something special.
                    </p>
                </motion.div>
            </div>

            {/* Curated Sections */}
            <div className="relative z-10 container-premium max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

                {/* 1. Gifts Under 499 (Large Feature) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-8">
                    <Link href="/collections/little-luxuries" className="block h-full group">
                        <GlassCard className="h-[300px] md:h-[400px] relative overflow-hidden flex items-center bg-gradient-to-br from-pink-500 via-rose-500 to-coral-600 border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">
                            <div className="relative z-10 p-8 md:p-12 max-w-lg text-white">
                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-widest mb-4">
                                    Budget Friendly
                                </span>
                                <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 leading-none">
                                    Little Luxuries <br />Under ₹499
                                </h2>
                                <p className="text-white/90 text-lg mb-8 max-w-sm">
                                    Small tokens that make a big impact. Keychains, badges, and more.
                                </p>
                                <span className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm group-hover:gap-4 transition-all">
                                    Shop Now <ChevronRight size={16} />
                                </span>
                            </div>
                            {/* Decorative Icon */}
                            <Gift className="absolute -right-12 -bottom-12 text-white opacity-10 rotate-12" size={300} />
                        </GlassCard>
                    </Link>
                </div>

                {/* 2. Drinkware */}
                <div className="col-span-1 md:col-span-1 lg:col-span-4">
                    <Link href="/collections/coffee-mugs" className="block h-full group">
                        <GlassCard className="h-[300px] md:h-[400px] relative overflow-hidden flex flex-col justify-end p-8 bg-blue-600 dark:bg-blue-800 border-none hover:shadow-xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0"></div>
                            <Coffee className="absolute top-8 right-8 text-white/20" size={80} />
                            <div className="relative z-10 text-white">
                                <h3 className="text-2xl font-bold mb-2">Drinkware</h3>
                                <p className="text-white/80 text-sm mb-4">Sip in style with our premium mugs and bottles.</p>
                                <span className="text-sm font-bold uppercase tracking-wider group-hover:text-coral-300 transition-colors">Explore &rarr;</span>
                            </div>
                        </GlassCard>
                    </Link>
                </div>

                {/* 3. For Kids */}
                <div className="col-span-1 md:col-span-1 lg:col-span-4">
                    <Link href="/collections/little-legends" className="block h-full group">
                        <GlassCard className="h-[280px] hover:bg-white/80 dark:hover:bg-navy-800/80 transition-all p-8 flex flex-col justify-between group-hover:border-coral-500/30">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 text-2xl">
                                    🚀
                                </div>
                                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">For The Little Legends</h3>
                                <p className="text-gray-500 text-sm">Books, puzzles, and fun learning tools.</p>
                            </div>
                            <span className="text-indigo-600 font-bold text-sm uppercase tracking-wider flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                View Collection <ArrowRight size={14} />
                            </span>
                        </GlassCard>
                    </Link>
                </div>

                {/* 4. Home & Decor */}
                <div className="col-span-1 md:col-span-1 lg:col-span-4">
                    <Link href="/collections/space-stories" className="block h-full group">
                        <GlassCard className="h-[280px] hover:bg-white/80 dark:hover:bg-navy-800/80 transition-all p-8 flex flex-col justify-between group-hover:border-emerald-500/30">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                                    <Home size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">Space Stories</h3>
                                <p className="text-gray-500 text-sm">Transform your space with posters and cushions.</p>
                            </div>
                            <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                View Decor <ArrowRight size={14} />
                            </span>
                        </GlassCard>
                    </Link>
                </div>

                {/* 5. Best Sellers / Favs */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                    <Link href="/collections/everyday-icons" className="block h-full group">
                        <GlassCard className="h-[280px] bg-navy-900 text-white p-8 flex flex-col justify-center text-center relative overflow-hidden border-none">
                            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-purple-900 opacity-50"></div>
                            <div className="relative z-10">
                                <Heart className="mx-auto mb-4 text-pink-500 fill-current" size={32} />
                                <h3 className="text-2xl font-bold mb-2">Fan Favorites</h3>
                                <p className="text-white/70 text-sm mb-6 max-w-xs mx-auto">See what everyone else is loving right now.</p>
                                <button className="px-6 py-2 bg-white text-navy-900 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-coral-500 hover:text-white transition-all">
                                    Shop Best Sellers
                                </button>
                            </div>
                        </GlassCard>
                    </Link>
                </div>

            </div>

            {/* Bottom Link to Full Catalog */}
            <div className="text-center mt-16">
                <Link href="/worlds" className="text-gray-500 hover:text-navy-900 dark:hover:text-white font-medium text-sm transition-colors border-b border-transparent hover:border-gray-400 pb-1">
                    &larr; Back to Full Catalog
                </Link>
            </div>

        </main>
    );
}
