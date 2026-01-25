'use client';

import React from 'react';
import Link from 'next/link';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { Leaf, Droplets, Sun, Recycle } from 'lucide-react';

export default function SustainabilityPage() {
    return (
        <div className="min-h-screen bg-[#FAF9F7] pb-20 pt-[var(--header-height)]">
            <AmbientBackground />

            {/* Hero */}
            <div className="relative h-[60vh] overflow-hidden flex items-center justify-center text-center px-6 bg-emerald-950">
                <img
                    src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop"
                    alt="Nature"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 text-white max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 mb-6 shadow-lg">
                        <Leaf size={16} className="text-emerald-300" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white">Conscious by Broncstudio</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
                        Good for them.<br />Good for the Planet.
                    </h1>
                    <p className="text-xl text-white/90 leading-relaxed">
                        We believe in a future where fashion doesn't cost the earth. That’s why we’re committed to sustainable sourcing, fair wages, and zero-plastic packaging.
                    </p>
                </div>
            </div>

            {/* The Cycle */}
            <div className="container-premium max-w-[1200px] mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center group">
                        <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                            <Leaf size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-navy-900 mb-3">Organic Cotton</h3>
                        <p className="text-gray-500 text-sm">Grown without harmful pesticides, keeping the soil and farmers safe.</p>
                    </div>
                    <div className="text-center group">
                        <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <Droplets size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-navy-900 mb-3">Eco-Friendly Dyes</h3>
                        <p className="text-gray-500 text-sm">Water-based inks that are safe for sensitive skin and the waterways.</p>
                    </div>
                    <div className="text-center group">
                        <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                            <Sun size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-navy-900 mb-3">Fair Wages</h3>
                        <p className="text-gray-500 text-sm">Crafted by artisans who are paid fairly and work in safe, happy conditions.</p>
                    </div>
                    <div className="text-center group">
                        <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-gray-600 mb-6 group-hover:scale-110 transition-transform">
                            <Recycle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-navy-900 mb-3">Plastic-Free</h3>
                        <p className="text-gray-500 text-sm">Your order arrives in cornstarch mailers and recycled paper boxes.</p>
                    </div>
                </div>
            </div>

            {/* Made In India Block */}
            <div className="bg-white py-24 border-y border-gray-100">
                <div className="container-premium max-w-[1000px] mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1628148601679-0522197305b0?q=80&w=1000&auto=format&fit=crop"
                            alt="Artisans"
                            className="rounded-3xl shadow-lg w-full"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-4xl font-heading font-bold text-navy-900 mb-6">Proudly Indian.</h2>
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                            Every thread tells a story of Indian heritage. By choosing Broncstudio, you're supporting local textile communities in Tamil Nadu and Karnataka.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-navy-900">100% Homegrown</div>
                            <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-navy-900">Global Standards</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
