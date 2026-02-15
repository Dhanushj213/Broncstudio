'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Sync active index with scroll position on mobile
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const width = scrollContainerRef.current.offsetWidth;
        const newIndex = Math.round(scrollLeft / width);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    const scrollTo = (index: number) => {
        if (!scrollContainerRef.current) return;
        const width = scrollContainerRef.current.offsetWidth;
        scrollContainerRef.current.scrollTo({
            left: index * width,
            behavior: 'smooth'
        });
        setActiveIndex(index);
    };

    return (
        <div className="w-full">
            {/* Main Stage */}
            <div className="relative group">
                {/* Mobile: Horizontal Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex md:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar w-full aspect-[3/4] bg-surface-2"
                >
                    {images.map((img, idx) => (
                        <div key={idx} className="w-full h-full flex-shrink-0 snap-center p-4">
                            <img
                                src={img}
                                alt={`View ${idx}`}
                                className="w-full h-full object-cover rounded-2xl shadow-sm"
                            />
                        </div>
                    ))}
                </div>

                {/* Desktop: Single Image Stage with Zoom */}
                <div
                    className="hidden md:block w-full aspect-[3/4] bg-surface-2 rounded-3xl overflow-hidden relative cursor-zoom-in group"
                    onMouseMove={(e) => {
                        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - left) / width) * 100;
                        const y = ((e.clientY - top) / height) * 100;
                        e.currentTarget.style.setProperty('--zoom-x', `${x}%`);
                        e.currentTarget.style.setProperty('--zoom-y', `${y}%`);
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={activeIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            src={images[activeIndex]}
                            alt="Main product view"
                            className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[2] origin-[var(--zoom-x)_var(--zoom-y)]"
                        />
                    </AnimatePresence>

                    {/* Zoom Hint (Hidden on hover) */}
                    <div className="absolute bottom-6 right-6 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                        <div className="bg-black/60 dark:bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20">
                            <Maximize2 size={20} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Mobile Page Indicator Overlay */}
                <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                    {images.map((_, i) => (
                        <div
                            key={i}
                            className={`transition-all duration-300 rounded-full ${i === activeIndex ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
                                }`}
                        />
                    ))}
                </div>

                {/* Desktop Navigation Arrows */}
                <div className="hidden md:block">
                    {activeIndex > 0 && (
                        <button
                            onClick={() => setActiveIndex(prev => prev - 1)}
                            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-primary shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    {activeIndex < images.length - 1 && (
                        <button
                            onClick={() => setActiveIndex(prev => prev + 1)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-primary shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop Thumbnails Grid */}
            <div className="hidden md:grid grid-cols-5 gap-3 mt-4">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => scrollTo(idx)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeIndex === idx
                            ? 'border-accent-orange'
                            : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                    >
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        {activeIndex === idx && (
                            <motion.div
                                layoutId="activeThumb"
                                className="absolute inset-0 bg-accent-orange/10"
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
