'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Heart, Menu, User, ChevronDown } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import MobileMenu from './MobileMenu';
import MegaMenu from './MegaMenu';
import { createClient } from '@/utils/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { DEPARTMENT_TAXONOMY } from '@/data/categories';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
    const [activeDepartment, setActiveDepartment] = useState<string | null>(null);

    const { openSearch, toggleWishlist } = useUI();
    const { cartCount } = useCart();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
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

    // Departments for the nav (keys from taxonomy)
    const departments = Object.keys(DEPARTMENT_TAXONOMY).map(key => ({
        key,
        ...DEPARTMENT_TAXONOMY[key as keyof typeof DEPARTMENT_TAXONOMY]
    }));

    return (
        <>
            <header
                className={`sticky top-0 z-[100] w-full bg-background/80 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'h-[60px] shadow-sm' : 'h-[72px]'}`}
                onMouseLeave={() => setActiveDepartment(null)}
            >
                <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between relative">

                    {/* Left: Hamburger */}
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 -ml-2 text-navy-900 dark:text-white hover:text-coral-500 transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Center: Logo */}
                    <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 md:gap-4 group">
                        <div className="relative h-12 md:h-16 w-auto aspect-[1/1] -mr-3 md:-mr-4">
                            <Image
                                src="/blacklogo.png"
                                alt="Broncstudio"
                                width={160}
                                height={160}
                                className="object-contain h-full w-auto dark:hidden"
                                priority
                            />
                            <Image
                                src="/whitelogo.png"
                                alt="Broncstudio"
                                width={160}
                                height={160}
                                className="object-contain h-full w-auto hidden dark:block"
                                priority
                            />
                        </div>
                        <div className="relative h-8 md:h-12 w-auto aspect-[4/1]">
                            <Image
                                src="/broncname.png"
                                alt="Broncstudio"
                                fill
                                className="object-contain dark:hidden"
                                priority
                            />
                            <Image
                                src="/broncnamey.png"
                                alt="Broncstudio"
                                fill
                                className="object-contain hidden dark:block"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation - Center */}


                    {/* Actions - Right */}
                    <div className="flex items-center gap-5 text-navy-900 dark:text-white ml-auto">
                        <button onClick={openSearch} className="hover:text-coral-500 transition-colors hidden md:block">
                            <Search size={22} strokeWidth={1.5} />
                        </button>
                        <button onClick={toggleWishlist} className="hover:text-coral-500 transition-colors">
                            <Heart size={22} strokeWidth={1.5} />
                        </button>
                        <Link href="/cart" className="hover:text-coral-500 transition-colors relative block">
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-in zoom-in">{cartCount}</span>
                            )}
                        </Link>
                        <Link href={currentUser ? '/profile' : '/login'} className="hover:text-coral-500 transition-colors hidden md:block">
                            <User size={22} strokeWidth={1.5} />
                        </Link>


                    </div>
                </div>

                {/* Mega Menu Dropdown */}
                <MegaMenu
                    activeDepartment={activeDepartment}
                    onClose={() => setActiveDepartment(null)}
                />

            </header>

            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} currentUser={currentUser} />
        </>
    );
}
