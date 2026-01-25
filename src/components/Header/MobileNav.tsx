'use client';

import React from 'react';
import { Home, Grid, Search, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';

const MobileNav = () => {
    const pathname = usePathname();
    const { openSearch, toggleWishlist } = useUI();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden bg-[#0B1220]/90 backdrop-blur-[18px] border-t border-white/10 h-[64px] pb-safe flex justify-around items-center px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
            <Link
                href="/"
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/') ? 'text-coral-500' : 'text-gray-400 hover:text-white'}`}
            >
                <Home size={22} strokeWidth={isActive('/') ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">Home</span>
            </Link>

            <Link
                href="/worlds"
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/worlds') ? 'text-coral-500' : 'text-gray-400 hover:text-white'}`}
            >
                <Grid size={22} strokeWidth={isActive('/worlds') ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">Worlds</span>
            </Link>

            {/* Triggers Search Overlay */}
            <button
                onClick={openSearch}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-gray-400 hover:text-white`}
            >
                <Search size={22} strokeWidth={1.5} />
                <span className="text-[10px] font-medium">Search</span>
            </button>

            {/* Triggers Wishlist Drawer */}
            <button
                onClick={toggleWishlist}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-gray-400 hover:text-white`}
            >
                <Heart size={22} strokeWidth={1.5} />
                <span className="text-[10px] font-medium">Saved</span>
            </button>

            <Link
                href="/cart"
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/cart') ? 'text-coral-500' : 'text-gray-400 hover:text-white'}`}
            >
                <div className="relative">
                    <ShoppingCart size={22} strokeWidth={isActive('/cart') ? 2.5 : 1.5} />
                    {/* Badge */}
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-coral-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">2</span>
                </div>
                <span className="text-[10px] font-medium">Cart</span>
            </Link>
        </div>
    );
};

export default MobileNav;
