'use client';

import React from 'react';
import Link from 'next/link';

export default function HeroVideo() {
    return (
        <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-black">
            {/* Video Background */}
            <video
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                autoPlay
                loop
                muted
                playsInline
                poster="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
            >
                <source src="https://videos.pexels.com/video-files/5668471/5668471-uhd_2560_1440_30fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Content Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center z-10">
                <span className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-3 animate-fade-in-up">
                    New Collection
                </span>
                <h2 className="text-white text-4xl md:text-6xl font-serif font-medium italic mb-6 animate-fade-in-up delay-100">
                    Summer Luxe
                </h2>
                <Link
                    href="/shop/new-arrivals"
                    className="bg-white text-navy-900 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg animate-fade-in-up delay-200"
                >
                    Shop Now
                </Link>
            </div>
        </section>
    );
}
