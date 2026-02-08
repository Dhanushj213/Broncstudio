'use client';

import React from 'react';
import AmbientBackground from '@/components/UI/AmbientBackground';

const FEATURES = [
    { name: 'Vogue Kids', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Vogue_logo.svg/2560px-Vogue_logo.svg.png', quote: "The coolest kids' brand coming out of India right now.", date: 'Oct 2023' },
    { name: 'Elle Decor', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Elle_logo.svg', quote: "Broncstudio brings a whimsical charm to nursery interiors.", date: 'Dec 2023' },
    { name: 'Mint Lounge', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Livemint_logo.svg/1024px-Livemint_logo.svg.png', quote: "Sustainable, stylish, and built for play.", date: 'Jan 2024' },
];

export default function PressPage() {
    return (
        <div className="min-h-screen bg-[#FAF9F7] dark:bg-black pb-20 pt-[var(--header-height)]">
            <AmbientBackground />

            <div className="container-premium max-w-[1000px] mx-auto px-6 py-20 text-center">
                <span className="text-coral-500 font-bold tracking-widest uppercase text-xs mb-4 block">As Seen In</span>
                <h1 className="text-5xl font-heading font-bold text-navy-900 dark:text-white mb-16">
                    Making Headlines.
                </h1>

                <div className="grid gap-12">
                    {FEATURES.map((feature, i) => (
                        <div key={i} className="bg-white dark:bg-white/5 p-12 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row items-center gap-12 text-left group">
                            <div className="w-full md:w-1/3 flex items-center justify-center p-6 bg-gray-50 dark:bg-white/10 rounded-2xl h-40">
                                <img
                                    src={feature.logo}
                                    alt={feature.name}
                                    className="max-h-12 max-w-full opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 dark:invert"
                                />
                            </div>
                            <div className="w-full md:w-2/3">
                                <blockquote className="text-2xl font-heading font-medium text-navy-900 dark:text-white mb-4 leading-normal">
                                    "{feature.quote}"
                                </blockquote>
                                <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                    {feature.name} • {feature.date}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24">
                    <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-6">Press Inquiries</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">For media kits and interview requests, please contact our PR team.</p>
                    <a href="mailto:press@broncstudio.com" className="bg-navy-900 dark:bg-white text-white dark:text-black font-bold py-3 px-8 rounded-full hover:bg-coral-500 dark:hover:bg-coral-400 transition-colors">
                        press@broncstudio.com
                    </a>
                </div>
            </div>
        </div>
    );
}
