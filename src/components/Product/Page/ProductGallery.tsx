'use client';

import React, { useState } from 'react';
// import Image from 'next/image'; // Assuming standard img for now to match project patterns

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image Area */}
            <div className="relative w-full aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden group cursor-zoom-in">
                <img
                    src={images[activeImage]}
                    alt="Product View"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-navy-900/10 backdrop-blur-md text-navy-900 text-[10px] font-bold px-2 py-1 rounded">
                    Tap to Zoom
                </div>
            </div>

            {/* Desktop Thumbnails (Hidden on mobile usually, but we want a unified feel, maybe hide scrollbar) */}
            <div className="hidden md:grid grid-cols-5 gap-3">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-navy-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                    >
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>

            {/* Mobile Dots Indicator (Since mobile users swipe) */}
            <div className="md:hidden flex justify-center gap-2 mt-2">
                {images.map((_, idx) => (
                    <div key={idx} className={`w-2 h-2 rounded-full transition-all ${activeImage === idx ? 'bg-navy-900 w-4' : 'bg-gray-300'}`} />
                ))}
            </div>

            {/* Note: Real mobile swipe logic would require a carousel library or custom touch handlers to sync activeImage state.
          For this component, we are relying on the 'Main Image' being the view. 
          To make it truly "Swipeable" on mobile while keeping this code simple:
          We can show a horizontal scroll container on mobile INSTEAD of the single main image.
      */}

            <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6 no-scrollbar absolute top-0 left-0 right-0 h-full opacity-0 pointer-events-none">
                {/* Placeholder for scroll logic if needed, but for now the desktop structure works 'okay' on mobile as a stacked view.
               Actually, let's implement a proper mobile view toggle or just keep the 'click to switch' for simplicity unless 'carousel' is demanded strictly.
               User asked for "Image carousel swipe".
           */}
            </div>
        </div>
    );
}

/* 
   Refining Mobile View:
   The above structure is Desktop-first.
   Let's modify the return to handle Mobile Carousel properly.
*/

export function ProductGalleryOptimized({ images }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);

    return (
        <div className="relative">
            {/* Desktop: Grid / Stack */}
            <div className="hidden md:flex flex-row-reverse gap-4 sticky top-24">
                <div className="flex-1 aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden relative group">
                    <img src={images[activeImage]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 origin-center" />
                </div>
                {/* Left side thumbnails */}
                <div className="flex flex-col gap-3 w-20">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onMouseEnter={() => setActiveImage(idx)}
                            className={`aspect-square rounded-lg overflow-hidden border transition-all ${activeImage === idx ? 'border-navy-900 ring-1 ring-navy-900' : 'border-gray-200'
                                }`}
                        >
                            <img src={img} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile: Carousel */}
            <div className="md:hidden -mx-6">
                <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 gap-1">
                    {images.map((img, idx) => (
                        <div key={idx} className="w-[85vw] flex-shrink-0 snap-center first:pl-6 last:pr-6">
                            <div className="aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden relative">
                                <img src={img} className="w-full h-full object-cover" />
                                {idx === 0 && <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur">1/{images.length}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
