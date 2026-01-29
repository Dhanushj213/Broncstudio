'use client';

import React from 'react';
import { ShoppingBag, Zap } from 'lucide-react';

interface StickyActionBarProps {
    price: number;
    originalPrice?: number;
    productName: string;
    productImage: string;
    onAddToCart: () => void;
    onBuyNow: () => void;
}

export default function StickyActionBar({ price, originalPrice, productName, productImage, onAddToCart, onBuyNow }: StickyActionBarProps) {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 600) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // If not visible on desktop (scroll check), we hide the desktop part but KEEP mobile part
    // Actually, let's make it universal but with different styles
    if (!isVisible) return null;

    return (
        <>
            {/* Mobile Bottom Bar (Always appears if visible, or maybe always? original code was fixed bottom) 
                Wait, original code was ALWAYS visible on mobile. Wokiee usually shows it always on mobile too.
                Let's separate the scroll logic.
            */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-100 p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center gap-3 animate-in slide-in-from-bottom-5">
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
                        <ShoppingBag size={18} /> Add
                    </button>
                    <button
                        onClick={onBuyNow}
                        className="flex-1 bg-navy-900 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 text-sm hover:bg-coral-500 shadow-lg shadow-coral-500/20 transition-all"
                    >
                        <Zap size={18} /> Buy Now
                    </button>
                </div>
            </div>

            {/* Desktop Top Sticky Bar (Wokiee Style) */}
            <div className={`hidden md:flex fixed top-0 left-0 right-0 z-[50] bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 px-8 justify-between items-center shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-[0%]' : '-translate-y-full'}`}>

                {/* Product Tiny Preview */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                        <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-navy-900 text-sm">{productName}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-navy-900">₹{price}</span>
                            {originalPrice && <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onAddToCart}
                        className="bg-gray-100 text-navy-900 font-bold rounded-lg px-6 py-2.5 flex items-center gap-2 text-sm hover:bg-gray-200 transition-colors"
                    >
                        <ShoppingBag size={16} /> Add to Cart
                    </button>
                    <button
                        onClick={onBuyNow}
                        className="bg-navy-900 text-white font-bold rounded-lg px-8 py-2.5 flex items-center gap-2 text-sm hover:bg-coral-500 shadow-md shadow-navy-900/10 hover:shadow-coral-500/20 transition-all"
                    >
                        <Zap size={16} /> Buy Now
                    </button>
                </div>
            </div>
        </>
    );
}
