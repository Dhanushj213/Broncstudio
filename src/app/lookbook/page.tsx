'use client';

import React from 'react';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { Instagram, ShoppingBag } from 'lucide-react';
import { getProductImage } from '@/utils/sampleImages';

const LOOKS = [
    { id: 1, image: getProductImage(1), user: '@momlife_adventures' },
    { id: 2, image: getProductImage(2), user: '@little.explorers' },
    { id: 3, image: getProductImage(3), user: '@broncstudio' },
    { id: 4, image: getProductImage(4), user: '@sunny_days' },
    { id: 5, image: getProductImage(5), user: '@creative_kids' },
    { id: 6, image: getProductImage(6), user: '@pet_pals' },
    { id: 7, image: getProductImage(7), user: '@style_mini' },
    { id: 8, image: getProductImage(8), user: '@bronc_fam' }
];

export default function LookbookPage() {
    return (
        <div className="min-h-screen bg-[#FAF9F7] pt-[var(--header-height)] pb-20">
            <AmbientBackground />

            <div className="container-premium max-w-[1200px] mx-auto px-6 py-12">
                <div className="text-center mb-16">
                    <span className="text-coral-500 font-bold tracking-widest uppercase text-xs mb-4 block">#SpottedInBronc</span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy-900 mb-6">
                        Real Kids. Real Style.
                    </h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Tag us using <strong>#Broncstudio</strong> to be featured in our gallery of legends.
                    </p>
                    <a href="#" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white border border-gray-200 rounded-full text-navy-900 font-bold hover:bg-navy-900 hover:text-white transition-colors">
                        <Instagram size={18} /> Follow @broncstudio
                    </a>
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 md:columns-3 lg:columns-4 gap-6 space-y-6">
                    {LOOKS.map(look => (
                        <div key={look.id} className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-gray-200">
                            <img
                                src={look.image}
                                alt={`Look by ${look.user}`}
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                                <div className="text-white text-xs font-bold uppercase tracking-widest text-right">
                                    Featured
                                </div>
                                <div>
                                    <div className="text-white font-bold mb-3">{look.user}</div>
                                    <button className="bg-white text-navy-900 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-coral-500 hover:text-white transition-colors w-fit">
                                        <ShoppingBag size={14} /> Shop Look
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
