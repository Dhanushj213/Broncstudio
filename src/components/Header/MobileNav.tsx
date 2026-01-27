'use client';

import React from 'react';
import { Home, Grid, Search, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { motion } from 'framer-motion';

const MobileNav = () => {
    const pathname = usePathname();
    const { openSearch, toggleWishlist } = useUI();
    const { cartCount } = useCart();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { name: 'Home', path: '/', icon: Home, type: 'link' },
        { name: 'Worlds', path: '/worlds', icon: Grid, type: 'link' },
        { name: 'Search', action: openSearch, icon: Search, type: 'button' },
        { name: 'Saved', action: toggleWishlist, icon: Heart, type: 'button' },
        { name: 'Cart', path: '/cart', icon: ShoppingCart, type: 'link', badge: cartCount },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden">
            {/* Glass Container */}
            <div className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-[20px] border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.3)]" />

            {/* Content Container with Safe Area */}
            <div className="relative flex justify-between items-center px-6 h-[64px] pb-[env(safe-area-inset-bottom)] box-content">
                {navItems.map((item) => {
                    const isItemActive = item.type === 'link' ? isActive(item.path!) : false;

                    // Common Content
                    const Content = () => (
                        <div className="relative flex flex-col items-center justify-center w-full h-full gap-1">
                            {/* Animated Background Indicator */}
                            {isItemActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 -top-2 -bottom-2 w-12 mx-auto bg-gradient-to-b from-coral-500/20 to-transparent rounded-full blur-md"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            <div className="relative group">
                                <item.icon
                                    size={24}
                                    strokeWidth={isItemActive ? 2.5 : 1.5}
                                    className={`transition-all duration-300 ${isItemActive
                                            ? 'text-coral-500 drop-shadow-[0_0_8px_rgba(255,100,100,0.4)]'
                                            : 'text-gray-400 group-active:scale-90 group-hover:text-gray-200'
                                        }`}
                                />
                                {item.badge && item.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-coral-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border-2 border-[#0B1220]">
                                        {item.badge}
                                    </span>
                                )}
                            </div>

                            {/* Label - Only show if active or provide subtle hint */}
                            {/* <span className={`text-[9px] font-medium transition-colors duration-300 ${isItemActive ? 'text-white' : 'text-gray-500'}`}>
                                {item.name}
                            </span> */}
                        </div>
                    );

                    if (item.type === 'link') {
                        return (
                            <Link
                                key={item.name}
                                href={item.path!}
                                className="relative flex-1 h-full flex items-center justify-center select-none"
                            >
                                <Content />
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={item.name}
                            onClick={item.action}
                            className="relative flex-1 h-full flex items-center justify-center select-none"
                        >
                            <Content />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNav;
