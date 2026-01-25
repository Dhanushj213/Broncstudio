'use client';

import React from 'react';

export default function AnnouncementBar() {
    return (
        <div className="bg-[#0B1220] text-white text-[10px] md:text-xs font-medium tracking-wide py-2 text-center relative z-[101]">
            <div className="flex container-premium items-center justify-center">
                <span>Free Shipping on all orders above ₹999</span>
                <span className="mx-2 opacity-50">•</span>
                <span className="text-coral-500 font-bold">New Collection Dropped</span>
            </div>
        </div>
    );
}
