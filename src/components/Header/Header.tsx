'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Heart, Menu, User } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';

const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'Worlds', href: '/worlds' },
    { label: 'Icons', href: '/shop/everyday-icons' },
    { label: 'Luxuries', href: '/shop/little-luxuries' },
    { label: 'Stories', href: '/shop/space-stories' },
    { label: 'Sale', href: '/shop/sale' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { openSearch, toggleWishlist } = useUI();
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-[100] w-full bg-[#FAF9F7] dark:bg-navy-900 transition-all duration-300 border-b border-black/5 dark:border-white/10 ${isScrolled ? 'h-[60px] shadow-sm' : 'h-[72px]'
                }`}
        >
            <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">

                <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                    <img src="/BroncStudio (2).png" alt="Broncstudio" className="h-12 w-auto object-contain block dark:hidden" />
                    <img src="/BroncStudio-Light.png" alt="Broncstudio" className="h-12 w-auto object-contain hidden dark:block" />
                    <span className="font-heading text-2xl font-bold text-navy-900 dark:text-white tracking-tight">Broncstudio.</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-8">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-[15px] font-medium text-navy-800 dark:text-gray-200 hover:text-coral-500 dark:hover:text-coral-400 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-5 text-navy-900 dark:text-white">
                    <button onClick={openSearch} className="hover:text-coral-500 dark:hover:text-coral-400 transition-colors">
                        <Search size={24} strokeWidth={1.5} />
                    </button>
                    <button onClick={toggleWishlist} className="hover:text-coral-500 dark:hover:text-coral-400 transition-colors hidden md:block">
                        <Heart size={24} strokeWidth={1.5} />
                    </button>
                    <Link href="/login" className="hover:text-coral-500 dark:hover:text-coral-400 transition-colors hidden md:block">
                        <User size={24} strokeWidth={1.5} />
                    </Link>
                    <Link href="/cart" className="hover:text-coral-500 dark:hover:text-coral-400 transition-colors relative">
                        <ShoppingCart size={24} strokeWidth={1.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-in zoom-in">{cartCount}</span>
                        )}
                    </Link>

                    <button className="md:hidden text-navy-900 dark:text-white">
                        <Menu size={24} strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </header>
    );
}
