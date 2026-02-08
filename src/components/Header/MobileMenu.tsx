import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ChevronRight, User, Heart, ShoppingBag, Globe, Sparkles, Home as HomeIcon, Tag, LayoutGrid, Gift, Monitor, Shirt, Pencil, PawPrint } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { DEPARTMENT_TAXONOMY } from '@/data/categories';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: SupabaseUser | null;
}

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

    const departments = Object.values(DEPARTMENT_TAXONOMY);

    // Manual Icon Mapping for Departments based on their href/slug
    const getDeptIcon = (href: string) => {
        if (href.includes('clothing')) return Shirt;
        if (href.includes('kids')) return Pencil; // Stationery
        if (href.includes('home')) return Monitor; // Home & Tech
        if (href.includes('gifts')) return Gift;
        if (href.includes('pets')) return PawPrint;
        return LayoutGrid;
    };

    const getDeptColor = (color: string) => {
        // Map taxonomy colors to tailwind classes if needed, or use inline styles for dynamic colors
        // For now using simple text colors
        switch (color) {
            case 'green': return 'text-green-600 bg-green-100';
            case 'blue': return 'text-blue-600 bg-blue-100';
            case 'purple': return 'text-purple-600 bg-purple-100';
            case 'indigo': return 'text-indigo-600 bg-indigo-100';
            case 'rose': return 'text-rose-600 bg-rose-100';
            case 'orange': return 'text-orange-600 bg-orange-100';
            default: return 'text-navy-600 bg-gray-100';
        }
    };

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
                        className="fixed inset-0 z-[1001] bg-navy-900/60 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 left-0 z-[1002] w-full max-w-[340px] bg-white/80 dark:bg-black/80 backdrop-blur-2xl shadow-2xl flex flex-col border-r border-white/20"
                    >
                        {/* Colorful Header - Now Transparent/Glassy */}
                        <div className="relative overflow-hidden p-6 bg-transparent text-navy-900 dark:text-white">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-coral-500/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <h2 className="font-heading text-2xl font-bold tracking-tight">Menu</h2>
                                    <p className="text-navy-600 dark:text-gray-400 text-sm mt-1">Discover your world.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">

                            {/* Main Links */}
                            <div className="space-y-1 mb-6">
                                <Link
                                    href="/"
                                    onClick={onClose}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] hover:translate-x-2 transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 text-muted flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                                        <HomeIcon size={20} />
                                    </div>
                                    <span className="font-bold text-primary text-lg">Home</span>
                                </Link>

                                <Link
                                    href="/shop"
                                    onClick={onClose}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] hover:translate-x-2 transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                        <Globe size={20} />
                                    </div>
                                    <span className="font-bold text-primary text-lg">Worlds</span>
                                </Link>

                                <Link
                                    href="/personalise"
                                    onClick={onClose}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] hover:translate-x-2 transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                                        <Sparkles size={20} />
                                    </div>
                                    <span className="font-bold text-primary text-lg">Personalise</span>
                                </Link>
                            </div>

                            <div className="h-px bg-divider mx-4 mb-6" />

                            <p className="px-4 text-xs font-bold uppercase tracking-widest text-muted mb-2">Departments</p>

                            {/* Departments */}
                            <div className="space-y-1">
                                {departments.map((dept: any) => {
                                    const Icon = getDeptIcon(dept.href);
                                    const colorClass = getDeptColor(dept.color || 'gray');

                                    return (
                                        <Link
                                            key={dept.label}
                                            href={dept.href}
                                            onClick={onClose}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] hover:translate-x-2 transition-all duration-300 group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] shadow-sm bg-gray-100 dark:bg-white/10 ${colorClass.split(' ')[0]} group-hover:text-white`}>
                                                    <Icon size={18} />
                                                </div>
                                                <span className="font-medium text-secondary group-hover:text-primary transition-colors">
                                                    {dept.label}
                                                </span>
                                            </div>
                                            <ChevronRight size={16} className="text-muted group-hover:text-primary transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="h-px bg-divider mx-4 my-6" />

                            <Link
                                href="/collections/sale"
                                onClick={onClose}
                                className="flex items-center gap-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Tag size={18} />
                                </div>
                                <span className="font-bold text-red-600 text-lg">Sale</span>
                            </Link>

                        </div>

                        {/* Bottom Actions (Profile & Utilities) */}
                        <div className="p-4 bg-transparent border-t border-gray-200 dark:border-white/10">
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/wishlist"
                                    onClick={onClose}
                                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-surface-2 hover:bg-coral-50 dark:hover:bg-coral-900/20 hover:text-coral-600 transition-colors text-secondary"
                                >
                                    <Heart size={20} />
                                    <span className="text-xs font-bold">Wishlist</span>
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-surface-2 hover:bg-coral-50 dark:hover:bg-coral-900/20 hover:text-coral-600 transition-colors text-secondary"
                                >
                                    <ShoppingBag size={20} />
                                    <span className="text-xs font-bold">Bag</span>
                                </Link>
                            </div>

                            <Link
                                href={currentUser ? "/profile" : "/login"}
                                onClick={onClose}
                                className="mt-3 flex items-center justify-center gap-2 p-3 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity font-bold text-sm"
                            >
                                <User size={18} />
                                <span>{currentUser ? 'My Profile' : 'Login / Sign Up'}</span>
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
