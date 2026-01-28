'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ChevronRight, User, LogIn, Heart, ShoppingBag } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: SupabaseUser | null;
}

const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'Worlds', href: '/worlds' },
    { label: 'Everyday Icons', href: '/shop/everyday-icons' },
    { label: 'Little Luxuries', href: '/shop/little-luxuries' },
    { label: 'Space Stories', href: '/shop/space-stories' },
    { label: 'Sale', href: '/shop/sale' },
];

const MobileMenu = ({ isOpen, onClose, currentUser }: MobileMenuProps) => {
    // Prevent scrolling when menu is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[1001] bg-navy-900/60 backdrop-blur-sm md:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-[1002] w-full max-w-[320px] bg-[#FAF9F7] dark:bg-navy-900 shadow-2xl md:hidden flex flex-col border-l border-black/5 dark:border-white/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
                            <span className="font-heading text-xl font-bold text-navy-900 dark:text-white tracking-tight">
                                Menu
                            </span>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 text-navy-600 dark:text-gray-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto py-4 px-6 space-y-2">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className="flex items-center justify-between py-3 group border-b border-dashed border-gray-200 dark:border-white/5 last:border-0"
                                >
                                    <span className="text-lg font-medium text-navy-800 dark:text-gray-200 group-hover:text-coral-500 transition-colors">
                                        {item.label}
                                    </span>
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-coral-500 transition-colors" />
                                </Link>
                            ))}
                        </div>

                        {/* Bottom Actions (Profile & Utilities) */}
                        <div className="p-6 bg-white dark:bg-navy-950 border-t border-black/5 dark:border-white/5 space-y-4">

                            {/* Profile Link - HIGHLIGHTED */}
                            {/* Profile Link - HIGHLIGHTED */}
                            <Link
                                href={currentUser ? "/profile" : "/login"}
                                onClick={onClose}
                                className="flex items-center gap-4 p-4 rounded-xl bg-navy-50 dark:bg-white/5 text-navy-900 dark:text-white hover:bg-coral-500/10 hover:text-coral-600 transition-all border border-transparent hover:border-coral-200"
                            >
                                <div className="w-10 h-10 rounded-full bg-coral-100 dark:bg-coral-900/50 flex items-center justify-center text-coral-600 dark:text-coral-400">
                                    <User size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm">
                                        {currentUser ? `Hi, ${currentUser.user_metadata?.full_name?.split(' ')[0] || 'User'}` : 'My Profile'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {currentUser ? 'View your account' : 'Login or Sign up'}
                                    </p>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </Link>

                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href="/wishlist"
                                    onClick={onClose}
                                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-navy-600 dark:text-gray-300"
                                >
                                    <Heart size={20} />
                                    <span className="text-xs font-medium">Wishlist</span>
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-navy-600 dark:text-gray-300"
                                >
                                    <ShoppingBag size={20} />
                                    <span className="text-xs font-medium">Bag</span>
                                </Link>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
