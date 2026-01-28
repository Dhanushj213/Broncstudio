'use client';

import React from 'react';
import { ShoppingBag, Zap } from 'lucide-react';

interface StickyActionBarProps {
    price: number;
    originalPrice?: number;
    onAddToCart: () => void;
    onBuyNow: () => void;
}

export default function StickyActionBar({ price, originalPrice, onAddToCart, onBuyNow }: StickyActionBarProps) {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1001] bg-white border-t border-gray-100 p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center gap-3">
            <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-bold uppercase">Total</span>
                <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-navy-900">₹{price}</span>
                    {originalPrice && <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>}
                </div>
            </div>

            <div className="flex-1 flex gap-2">
                <button
                    onClick={onAddToCart}
                    className="flex-1 bg-gray-100 text-navy-900 font-bold rounded-xl py-3 flex items-center justify-center gap-2 text-sm hover:bg-gray-200"
                >
                    <ShoppingBag size={18} /> Add to Bag
                </button>
                <button
                    onClick={onBuyNow}
                    className="flex-1 bg-navy-900 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 text-sm hover:bg-coral-500 shadow-lg shadow-coral-500/20 transition-all"
                >
                    <Zap size={18} /> Buy Now
                </button>
            </div>
        </div>
    );
}
