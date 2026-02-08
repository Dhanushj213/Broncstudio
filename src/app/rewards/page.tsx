'use client';

import React from 'react';
import Link from 'next/link';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { motion } from 'framer-motion';
import { Trophy, Star, Crown, Gift, ArrowRight } from 'lucide-react';

export default function RewardsPage() {
    return (
        <div className="min-h-screen bg-[#FAF9F7] dark:bg-black pb-20 pt-[var(--header-height)]">
            <AmbientBackground />

            {/* Hero */}
            <div className="relative overflow-hidden mb-16">
                <div className="container-premium max-w-[1000px] mx-auto px-6 text-center py-20 relative z-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white dark:bg-white/10 px-4 py-2 rounded-full border border-gray-100 dark:border-white/10 shadow-sm mb-6">
                            <Crown size={18} className="text-amber-500" />
                            <span className="text-xs font-bold text-navy-900 dark:text-white uppercase tracking-widest">Little Legends Club</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-navy-900 dark:text-white mb-6">
                            Turn shopping into <br /> <span className="text-coral-500">Adventures.</span>
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                            Join our loyalty program to earn stars, unlock exclusive rewards, and get surprises on your little legend's birthday!
                        </p>
                        <Link href="/login" className="inline-flex h-14 items-center justify-center rounded-full bg-navy-900 dark:bg-white px-10 text-base font-bold text-white dark:text-black transition-all hover:bg-coral-500 dark:hover:bg-coral-400 hover:scale-105 shadow-xl">
                            Join the Club
                        </Link>
                        <p className="mt-4 text-sm text-gray-400">Already a member? <Link href="/login" className="underline hover:text-navy-900 dark:hover:text-white">Sign in</Link></p>
                    </motion.div>
                </div>
            </div>

            {/* Tiers */}
            <div className="container-premium max-w-[1200px] mx-auto px-6 mb-24">
                <h2 className="text-3xl font-heading font-bold text-center text-navy-900 dark:text-white mb-12">Level Up Your Legend Status</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Tier 1 */}
                    <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 dark:bg-amber-500/10 rounded-bl-[100px] opacity-50 transition-opacity group-hover:opacity-100" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                                <Star size={32} fill="currentColor" />
                            </div>
                            <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Scout</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">0 - 499 Stars</p>
                            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Earn 1 Star per ₹1</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Birthday Surprise (20% Off)</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Early Access to Sales</li>
                            </ul>
                        </div>
                    </div>

                    {/* Tier 2 */}
                    <div className="bg-navy-900 dark:bg-white/10 dark:border dark:border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden transform md:-translate-y-4">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-coral-500 rounded-bl-[100px] opacity-20" />
                        <div className="relative z-10 text-white">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 text-coral-400 flex items-center justify-center mb-6 border border-white/10">
                                <Trophy size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Explorer</h3>
                            <p className="text-white/60 mb-6 font-bold">500 - 1999 Stars</p>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-coral-500" /> 1.5 Stars per ₹1</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-coral-500" /> Free Shipping Always</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-coral-500" /> Mystery Gift Box</li>
                            </ul>
                        </div>
                    </div>

                    {/* Tier 3 */}
                    <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 dark:bg-purple-500/10 rounded-bl-[100px] opacity-50 transition-opacity group-hover:opacity-100" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                                <Crown size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Guardian</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">2000+ Stars</p>
                            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> 2 Stars per ₹1</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Personal Stylist</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Annual Family Photo Shoot</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ways to Earn */}
            <div className="container-premium max-w-[800px] mx-auto px-6">
                <h3 className="text-2xl font-heading font-bold text-center text-navy-900 dark:text-white mb-8">More Ways to Earn</h3>
                <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/5">
                    <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center text-navy-900 dark:text-white font-bold">1</div>
                            <div className="font-bold text-navy-900 dark:text-white">Follow us on Instagram</div>
                        </div>
                        <div className="font-bold text-coral-500">+50 Stars</div>
                    </div>
                    <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center text-navy-900 dark:text-white font-bold">2</div>
                            <div className="font-bold text-navy-900 dark:text-white">Write a Review</div>
                        </div>
                        <div className="font-bold text-coral-500">+100 Stars</div>
                    </div>
                    <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center text-navy-900 dark:text-white font-bold">3</div>
                            <div className="font-bold text-navy-900 dark:text-white">Refer a Friend</div>
                        </div>
                        <div className="font-bold text-coral-500">+500 Stars</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
