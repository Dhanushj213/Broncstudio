'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, Menu, User } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import MobileMenu from './MobileMenu';
import { createClient } from '@/utils/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'Worlds', href: '/worlds' },
    { label: 'Icons', href: '/collections/everyday-icons' },
    { label: 'Luxuries', href: '/collections/little-luxuries' },
    { label: 'Stories', href: '/collections/space-stories' },
    { label: 'Sale', href: '/collections/sale' },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
    const { openSearch, toggleWishlist } = useUI();
    const { cartCount } = useCart();
    const supabase = createClient();

    useEffect(() => {
        // Check initial session
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
        };
        checkUser();

        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: { user: SupabaseUser | null } | null) => {
            setCurrentUser(session?.user ?? null);
        });

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [supabase.auth]);

    return (
        <>
            <header
                className={`sticky top-0 z-[100] w-full bg-[#FAF9F7] dark:bg-navy-900 transition-all duration-300 border-b border-black/5 dark:border-white/10 ${isScrolled ? 'h-[60px] shadow-sm' : 'h-[72px]'
                    }`}
            >
                <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">

                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <img src="/BroncStudio (2).png" alt="Broncstudio" className="h-8 md:h-12 w-auto object-contain block dark:hidden" />
                        <img src="/BroncStudio-Light.png" alt="Broncstudio" className="h-8 md:h-12 w-auto object-contain hidden dark:block" />
                        <span className="font-heading text-xl md:text-2xl font-bold text-navy-900 dark:text-white tracking-tight">Broncstudio.</span>
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
                        <button onClick={openSearch} className="hover:text-coral-500 dark:hover:text-coral-400 transition-colors hidden md:block">
                            <Search size={24} strokeWidth={1.5} />
                        </button>
                        <button onClick={toggleWishlist} className="hover:text-coral-500 dark:hover:text-coral-400 transition-colors hidden md:block">
                            <Heart size={24} strokeWidth={1.5} />
                        </button>
                        <Link href={currentUser ? '/profile' : '/login'} className="hover:text-coral-500 dark:hover:text-coral-400 transition-colors hidden md:block">
                            <User size={24} strokeWidth={1.5} />
                        </Link>
                        <Link href="/cart" className="hover:text-coral-500 dark:hover:text-coral-400 transition-colors relative block">
                            <ShoppingBag size={24} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-in zoom-in">{cartCount}</span>
                            )}
                        </Link>

                        <button
                            className="md:hidden text-navy-900 dark:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </header>

            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} currentUser={currentUser} />
        </>
    );
}
