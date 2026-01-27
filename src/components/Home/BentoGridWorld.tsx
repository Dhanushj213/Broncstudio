'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassCard from '@/components/UI/GlassCard';
import { ArrowUpRight } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function BentoGridWorld() {
    return (
        <section className="relative z-10 max-w-[1200px] mx-auto px-6 py-8">
            {/* SPEC: Height 560px, 4 cols x 2 rows, Gap 20px on Desktop. Horizontal Scroll on Mobile. */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pb-4 md:grid md:grid-cols-4 md:grid-rows-2 md:gap-[20px] md:h-[560px] md:pb-0 -mx-6 px-6 md:mx-auto md:px-0"
            >
                {/* 1. Little Legends - Main Large Card (2 rows x 2 cols) */}
                <motion.div variants={itemVariants} className="flex-shrink-0 w-[85vw] md:w-auto md:col-span-2 md:row-span-2 relative group h-[400px] md:h-full cursor-pointer snap-center">
                    <Link href="/shop/little-legends" className="block h-full w-full">
                        <div className="h-full w-full rounded-3xl overflow-hidden relative shadow-lg">
                            {/* Image & Overlay */}
                            <div className="absolute inset-0 bg-[url('/bentogrid/littlelegends.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                            {/* Content */}
                            <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-10 text-white">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-3">
                                        <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase bg-white text-navy-900 rounded-full shadow-lg">
                                            Kids & Play
                                        </span>
                                        <h2 className="text-4xl md:text-6xl font-heading font-medium leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                                            Little Legends
                                        </h2>
                                        <p className="text-white/90 font-medium text-lg max-w-sm border-l-2 border-white/50 pl-3 drop-shadow-md">
                                            Where curiosity begins.
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-navy-900 flex items-center justify-center transform group-hover:-rotate-45 transition-all duration-500 shadow-xl group-hover:scale-110">
                                        <ArrowUpRight size={24} strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* 2. Everyday Icons */}
                <motion.div variants={itemVariants} className="flex-shrink-0 w-[85vw] md:w-auto md:col-span-1 md:row-span-1 h-[400px] md:h-full cursor-pointer snap-center">
                    <Link href="/shop/everyday-icons" className="block h-full w-full">
                        <div className="h-full w-full rounded-3xl overflow-hidden relative group shadow-lg">
                            <div className="absolute inset-0 bg-[url('/bentogrid/everydayicon.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

                            {/* Gradient for Text Lift */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />

                            <div className="relative z-20 h-full p-6 flex flex-col items-center justify-center text-center">
                                <div className="space-y-2 group-hover:-translate-y-2 transition-transform duration-500">
                                    <h2 className="text-3xl md:text-3xl font-heading text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">Everyday Icons</h2>
                                    <p className="text-[10px] text-white/90 font-bold uppercase tracking-[0.25em] drop-shadow-md">Fashion for Everyone</p>
                                </div>
                                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white">
                                    <ArrowUpRight size={24} strokeWidth={1.5} className="drop-shadow-md" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* 3. Little Luxuries */}
                <motion.div variants={itemVariants} className="flex-shrink-0 w-[85vw] md:w-auto md:col-span-1 md:row-span-1 h-[400px] md:h-full cursor-pointer snap-center">
                    <Link href="/shop/little-luxuries" className="block h-full w-full">
                        <div className="h-full w-full rounded-3xl overflow-hidden relative group shadow-lg">
                            <div className="absolute inset-0 bg-[url('/bentogrid/littlelux.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />

                            <div className="relative z-20 h-full p-6 flex flex-col items-center justify-center text-center">
                                <div className="space-y-2 group-hover:-translate-y-2 transition-transform duration-500">
                                    <h2 className="text-3xl md:text-3xl font-heading text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">Little Luxuries</h2>
                                    <p className="text-[10px] text-white/90 font-bold uppercase tracking-[0.25em] drop-shadow-md">Gifting & Joys</p>
                                </div>
                                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white">
                                    <ArrowUpRight size={24} strokeWidth={1.5} className="drop-shadow-md" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* 4. Space Stories */}
                <motion.div variants={itemVariants} className="flex-shrink-0 w-[85vw] md:w-auto md:col-span-1 md:row-span-1 h-[400px] md:h-full cursor-pointer snap-center">
                    <Link href="/shop/space-stories" className="block h-full w-full">
                        <div className="h-full w-full rounded-3xl overflow-hidden relative group shadow-lg">
                            <div className="absolute inset-0 bg-[url('/bentogrid/spacestories.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />

                            <div className="relative z-20 h-full p-6 flex flex-col items-center justify-center text-center">
                                <div className="space-y-2 group-hover:-translate-y-2 transition-transform duration-500">
                                    <h2 className="text-3xl md:text-3xl font-heading text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">Space Stories</h2>
                                    <p className="text-[10px] text-white/90 font-bold uppercase tracking-[0.25em] drop-shadow-md">Home & Comfort</p>
                                </div>
                                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white">
                                    <ArrowUpRight size={24} strokeWidth={1.5} className="drop-shadow-md" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* 5. Style Extras */}
                <motion.div variants={itemVariants} className="flex-shrink-0 w-[85vw] md:w-auto md:col-span-1 md:row-span-1 h-[400px] md:h-full cursor-pointer snap-center">
                    <Link href="/shop/style-extras" className="block h-full w-full">
                        <div className="h-full w-full rounded-3xl overflow-hidden relative group shadow-lg">
                            <div className="absolute inset-0 bg-[url('/bentogrid/accessiories.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />

                            <div className="relative z-20 h-full p-6 flex flex-col items-center justify-center text-center">
                                <div className="space-y-2 group-hover:-translate-y-2 transition-transform duration-500">
                                    <h2 className="text-3xl md:text-3xl font-heading text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">Style Extras</h2>
                                    <p className="text-[10px] text-white/90 font-bold uppercase tracking-[0.25em] drop-shadow-md">Accessories</p>
                                </div>
                                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white">
                                    <ArrowUpRight size={24} strokeWidth={1.5} className="drop-shadow-md" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

            </motion.div>
        </section>
    );
}
