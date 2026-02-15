import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ChevronRight, User, Heart, ShoppingBag, Globe, Sparkles, Home as HomeIcon, Tag, LayoutGrid, Gift, Monitor, Shirt, Pencil, PawPrint } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { DEPARTMENT_TAXONOMY } from '@/data/categories';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: SupabaseUser | null;
}

const MobileMenu = ({ isOpen, onClose, currentUser }: MobileMenuProps) => {
    const { openWishlist } = useUI();
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
        switch (color) {
            case 'green': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
            case 'blue': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
            case 'purple': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
            case 'indigo': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20';
            case 'rose': return 'text-rose-600 bg-rose-100 dark:bg-rose-900/20';
            case 'orange': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
            default: return 'text-navy-600 bg-gray-100 dark:bg-white/10';
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 24
            }
        }
    };

    const buttonHoverEffect = {
        scale: 1.02,
        x: 8,
        transition: { type: "spring" as const, stiffness: 400, damping: 10 }
    };

    const tapEffect = { scale: 0.96 };

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
                        className="fixed inset-y-0 left-0 z-[1002] w-full max-w-[340px] bg-gradient-to-b from-gray-50 to-gray-200 dark:from-zinc-900 dark:to-black backdrop-blur-3xl shadow-[10px_0_50px_rgba(0,0,0,0.3)] flex flex-col border-r border-white/10"
                    >
                        {/* Colorful Header */}
                        <div className="relative overflow-hidden p-8 border-b border-black/5 dark:border-white/5 shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-coral-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <h2 className="font-heading text-3xl font-bold tracking-tight text-navy-900 dark:text-white drop-shadow-sm">Menu</h2>
                                    <p className="text-navy-600/70 dark:text-gray-400 text-sm mt-1 font-medium italic">Discover your world.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_10px_rgba(255,255,255,0.5)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),-2px_-2px_10px_rgba(255,255,255,0.05)] transition-all active:shadow-inner"
                                >
                                    <X size={20} className="text-navy-900 dark:text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex-1 overflow-y-auto py-6 px-4 space-y-2"
                        >

                            {/* Main Links */}
                            <div className="space-y-1 mb-6">
                                <motion.div variants={itemVariants}>
                                    <Link
                                        href="/"
                                        onClick={onClose}
                                        className="block px-2"
                                    >
                                        <motion.div
                                            whileHover={{ x: 4 }}
                                            whileTap={tapEffect}
                                            className="flex items-center gap-4 p-4 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-[8px_8px_16px_rgba(0,0,0,0.05),-4px_-4px_16px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.4),-4px_-4px_16px_rgba(255,255,255,0.02)] transition-all duration-300 group"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 shadow-inner flex items-center justify-center text-navy-900 dark:text-white group-hover:bg-navy-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-navy-900 transition-all duration-300">
                                                <HomeIcon size={22} />
                                            </div>
                                            <span className="font-bold text-navy-900 dark:text-white text-lg">Home</span>
                                        </motion.div>
                                    </Link>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Link
                                        href="/shop"
                                        onClick={onClose}
                                        className="block px-2"
                                    >
                                        <motion.div
                                            whileHover={{ x: 4 }}
                                            whileTap={tapEffect}
                                            className="flex items-center gap-4 p-4 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-[8px_8px_16px_rgba(0,0,0,0.05),-4px_-4px_16px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.4),-4px_-4px_16px_rgba(255,255,255,0.02)] transition-all duration-300 group"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 shadow-inner flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                                                <Globe size={22} />
                                            </div>
                                            <span className="font-bold text-navy-900 dark:text-white text-lg">Categories</span>
                                        </motion.div>
                                    </Link>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Link
                                        href="/personalise"
                                        onClick={onClose}
                                        className="block px-2"
                                    >
                                        <motion.div
                                            whileHover={{ x: 4 }}
                                            whileTap={tapEffect}
                                            className="flex items-center gap-4 p-4 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-[8px_8px_16px_rgba(0,0,0,0.05),-4px_-4px_16px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.4),-4px_-4px_16px_rgba(255,255,255,0.02)] transition-all duration-300 group"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 shadow-inner flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                                                <Sparkles size={22} />
                                            </div>
                                            <span className="font-bold text-navy-900 dark:text-white text-lg">Personalise</span>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="h-px bg-black/5 dark:bg-white/5 shadow-[0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[0_1px_0_rgba(255,255,255,0.05)] mx-4 mb-6" />

                            <motion.p variants={itemVariants} className="px-4 text-xs font-bold uppercase tracking-widest text-muted mb-2">Departments</motion.p>

                            {/* Departments */}
                            <div className="space-y-1">
                                {departments.map((dept: any) => {
                                    const Icon = getDeptIcon(dept.href);
                                    const colorClass = getDeptColor(dept.color || 'gray');

                                    return (
                                        <motion.div key={dept.label} variants={itemVariants}>
                                            <Link
                                                href={dept.href}
                                                onClick={onClose}
                                                className="block px-2"
                                            >
                                                <motion.div
                                                    whileHover={{ x: 4 }}
                                                    whileTap={tapEffect}
                                                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300 group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-[2px_2px_5px_rgba(0,0,0,0.1),-1px_-1px_5px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),-2px_-2px_10px_rgba(255,255,255,0.05)] bg-gray-100 dark:bg-zinc-800 ${colorClass.split(' ')[0]} group-hover:scale-105`}>
                                                            <Icon size={20} />
                                                        </div>
                                                        <span className="font-bold text-navy-900/80 dark:text-white/80 group-hover:text-navy-900 dark:group-hover:text-white transition-colors">
                                                            {dept.label}
                                                        </span>
                                                    </div>
                                                    <ChevronRight size={16} className="text-navy-900/30 dark:text-white/20 group-hover:text-navy-900 dark:group-hover:text-white transition-all duration-300" />
                                                </motion.div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <motion.div variants={itemVariants} className="h-px bg-divider mx-4 my-6" />

                            <motion.div variants={itemVariants} className="pt-4 px-2">
                                <Link
                                    href="/collections/sale"
                                    onClick={onClose}
                                    className="block"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={tapEffect}
                                        className="flex items-center gap-4 p-4 rounded-3xl bg-red-500 text-white shadow-[0_10px_20px_rgba(239,68,68,0.3)] dark:shadow-[0_10px_20px_rgba(239,68,68,0.2)] group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                            <Tag size={22} />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-xl uppercase tracking-tighter">Big Sale</span>
                                            <span className="text-xs font-medium opacity-80 uppercase tracking-widest">Limited offers only</span>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>

                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 25 }}
                            className="p-6 bg-gray-100/50 dark:bg-zinc-900/50 border-t border-black/5 dark:border-white/5"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <motion.button
                                    whileHover={{ y: -4, transition: { type: "spring" as const, stiffness: 400, damping: 10 } }}
                                    whileTap={tapEffect}
                                    onClick={() => {
                                        onClose();
                                        openWishlist();
                                    }}
                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-[4px_4px_10px_rgba(0,0,0,0.05),-2px_-2px_10px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_15px_rgba(0,0,0,0.4),-2px_-2px_15px_rgba(255,255,255,0.02)] hover:text-coral-600 transition-colors text-navy-900 dark:text-white"
                                >
                                    <Heart size={20} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Wishlist</span>
                                </motion.button>
                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className="block"
                                >
                                    <motion.div
                                        whileHover={{ y: -4, transition: { type: "spring" as const, stiffness: 400, damping: 10 } }}
                                        whileTap={tapEffect}
                                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-[4px_4px_10px_rgba(0,0,0,0.05),-2px_-2px_10px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_15px_rgba(0,0,0,0.4),-2px_-2px_15px_rgba(255,255,255,0.02)] hover:text-blue-600 transition-colors text-navy-900 dark:text-white"
                                    >
                                        <ShoppingBag size={20} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Bag</span>
                                    </motion.div>
                                </Link>
                            </div>

                            <motion.div
                                className="mt-4"
                                whileHover={{ scale: 1.02 }}
                                whileTap={tapEffect}
                            >
                                <Link
                                    href={currentUser ? "/profile" : "/login"}
                                    onClick={onClose}
                                    className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-navy-900 text-white dark:bg-white dark:text-black font-bold shadow-xl shadow-navy-900/20 dark:shadow-white/10"
                                >
                                    <User size={20} />
                                    <span className="uppercase tracking-widest text-sm">{currentUser ? 'My Profile' : 'Login / Sign Up'}</span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
