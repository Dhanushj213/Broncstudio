import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ChevronRight, User, Heart, ShoppingBag, Globe, Sparkles, Home as HomeIcon, Tag, LayoutGrid, Gift, Monitor, Shirt, Pencil } from 'lucide-react';
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
                        className="fixed inset-y-0 left-0 z-[1002] w-full max-w-[340px] bg-[#FAF9F7] dark:bg-navy-950 shadow-2xl flex flex-col border-r border-black/5 dark:border-white/10"
                    >
                        {/* Colorful Header */}
                        <div className="relative overflow-hidden p-6 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-coral-500/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <h2 className="font-heading text-2xl font-bold tracking-tight">Menu</h2>
                                    <p className="text-navy-200 text-sm mt-1">Discover your world.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
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
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-gray-300 flex items-center justify-center group-hover:bg-navy-600 group-hover:text-white transition-colors">
                                        <HomeIcon size={20} />
                                    </div>
                                    <span className="font-bold text-navy-900 dark:text-white text-lg">Home</span>
                                </Link>

                                <Link
                                    href="/shop"
                                    onClick={onClose}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <Globe size={20} />
                                    </div>
                                    <span className="font-bold text-navy-900 dark:text-white text-lg">Worlds</span>
                                </Link>

                                <Link
                                    href="/personalise"
                                    onClick={onClose}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                        <Sparkles size={20} />
                                    </div>
                                    <span className="font-bold text-navy-900 dark:text-white text-lg">Personalise</span>
                                </Link>
                            </div>

                            <div className="h-px bg-gray-200 dark:bg-white/10 mx-4 mb-6" />

                            <p className="px-4 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Departments</p>

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
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${colorClass.replace('text-', 'bg-').split(' ')[1]} ${colorClass.split(' ')[0]}`}>
                                                    <Icon size={18} />
                                                </div>
                                                <span className="font-medium text-navy-800 dark:text-gray-200 group-hover:text-navy-900 dark:group-hover:text-white transition-colors">
                                                    {dept.label}
                                                </span>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-300 group-hover:text-coral-500 transition-colors opacity-0 group-hover:opacity-100" />
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="h-px bg-gray-200 dark:bg-white/10 mx-4 my-6" />

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
                        <div className="p-4 bg-white dark:bg-navy-900 border-t border-black/5 dark:border-white/5">
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/wishlist"
                                    onClick={onClose}
                                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-coral-50 dark:hover:bg-coral-900/20 hover:text-coral-600 transition-colors text-navy-600 dark:text-gray-300"
                                >
                                    <Heart size={20} />
                                    <span className="text-xs font-bold">Wishlist</span>
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-coral-50 dark:hover:bg-coral-900/20 hover:text-coral-600 transition-colors text-navy-600 dark:text-gray-300"
                                >
                                    <ShoppingBag size={20} />
                                    <span className="text-xs font-bold">Bag</span>
                                </Link>
                            </div>

                            <Link
                                href={currentUser ? "/profile" : "/login"}
                                onClick={onClose}
                                className="mt-3 flex items-center justify-center gap-2 p-3 rounded-xl bg-navy-900 dark:bg-white text-white dark:text-navy-900 hover:bg-coral-600 dark:hover:bg-gray-200 transition-colors font-bold text-sm"
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
