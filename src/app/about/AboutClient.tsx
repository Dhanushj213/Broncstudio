'use client';

import React from 'react';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { motion } from 'framer-motion';
import { Heart, Globe, PenTool, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AboutClient() {
    return (
        <div className="min-h-screen bg-[#FAF9F7] pb-20">
            <AmbientBackground />

            {/* 1. Hero Section */}
            <div className="relative pt-[var(--header-height)] pb-12 overflow-hidden">
                <div className="container-premium max-w-[1000px] mx-auto px-6 text-center z-10 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-coral-500 font-bold tracking-widest uppercase text-xs mb-4 block">The Broncstudio Story</span>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-navy-900 mb-6 leading-[1.1]">
                            Stories, Style,<br />& Smiles.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            We believe childhood is a story waiting to be written. We’re here to add a little color, comfort, and magic to those pages.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* 2. Brand Image / Manifesto */}
            <div className="container-premium max-w-[1200px] mx-auto px-6 mb-24">
                <div className="relative aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden bg-gray-200 shadow-xl">
                    <img
                        src="https://images.unsplash.com/photo-1503919545874-86c477cc25a9?q=80&w=2000&auto=format&fit=crop"
                        alt="Kids playing and laughing"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-navy-900/20 mix-blend-multiply" />
                    <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 text-white max-w-lg">
                        <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">Designed for Play, Crafted for Love.</h3>
                        <p className="text-white/90 text-sm md:text-base">Every piece we make passes the "Treehouse Test" — durable enough for adventures, soft enough for naps.</p>
                    </div>
                </div>
            </div>

            {/* 3. Our Values */}
            <div className="container-premium max-w-[1000px] mx-auto px-6 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-900 mb-6">Rooted in India.<br />Made for the World.</h2>
                        <div className="space-y-6">
                            <p className="text-gray-600 leading-relaxed">
                                Broncstudio started with a simple idea: why choose between style and comfort? We wanted to create a brand that celebrates the vibrant spirit of Indian craftsmanship while delivering the modern aesthetics that parents love.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                From sourcing the softest cottons in Southern India to working with skilled artisans who pour their heart into every stitch, our journey is one of community and care.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                                <Heart size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900 mb-1">Made with Love</h4>
                                <p className="text-xs text-gray-500">Ethically crafted in safe, happy environments.</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900 mb-1">Sustainable</h4>
                                <p className="text-xs text-gray-500">Eco-friendly materials and plastic-free packaging.</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                                <PenTool size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900 mb-1">Original Design</h4>
                                <p className="text-xs text-gray-500">Hand-drawn prints you won't find anywhere else.</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900 mb-1">Quality First</h4>
                                <p className="text-xs text-gray-500">Fabrics that stay soft, wash after wash.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Founder's Note */}
            <div className="bg-white border-y border-gray-100 py-20">
                <div className="container-premium max-w-[800px] mx-auto px-6 text-center">
                    <img
                        src="/BroncStudio (2).png"
                        alt="Broncstudio Logo"
                        className="h-16 w-auto mx-auto mb-8"
                    />
                    <blockquote className="text-2xl md:text-3xl font-heading font-medium text-navy-900 leading-normal mb-8">
                        "We aren't just selling clothes; we're dressing memories. Every birthday, every playdate, every quiet reading corner—we want to be a cozy part of it."
                    </blockquote>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mb-3">
                            {/* Placeholder for founder image */}
                            <div className="w-full h-full bg-navy-900 flex items-center justify-center text-white font-bold">D</div>
                        </div>
                        <div className="font-bold text-navy-900">DHANUSH J</div>
                        <div className="text-sm text-gray-500">Founder, Broncstudio</div>
                    </div>
                </div>
            </div>

            {/* 5. CTA */}
            <div className="py-20 text-center px-6">
                <h2 className="text-3xl font-heading font-bold text-navy-900 mb-6">Ready to make memories?</h2>
                <Link href="/" className="inline-flex h-12 items-center justify-center rounded-full bg-navy-900 px-8 text-sm font-bold text-white transition-all hover:bg-coral-500 hover:scale-105">
                    Start Exploring
                </Link>
            </div>
        </div>
    );
}
