'use client';

import React, { useEffect, useRef } from 'react';
import { useUI } from '@/context/UIContext';
import { Search, X, TrendingUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function SearchOverlay() {
    const { isSearchOpen, closeSearch, openSearch } = useUI();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                isSearchOpen ? closeSearch() : openSearch();
            }
            if (e.key === 'Escape') {
                closeSearch();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchOpen, closeSearch, openSearch]);

    // Focus input when open
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isSearchOpen]);

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1100] bg-navy-900/60 backdrop-blur-xl flex items-start justify-center pt-20 md:pt-32"
                    onClick={closeSearch} // Close on backdrop click
                >
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()} // Prevent close on content click
                        className="w-full max-w-2xl px-6"
                    >
                        <div className="relative mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search for products, brands, or stories..."
                                className="w-full bg-white/10 border border-white/20 rounded-2xl py-6 pl-14 pr-16 text-xl text-white placeholder-gray-400 focus:outline-none focus:border-coral-500 focus:ring-1 focus:ring-coral-500 shadow-2xl"
                            />
                            <button
                                onClick={closeSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <span className="text-xs uppercase font-bold border border-white/20 px-2 py-1 rounded hidden md:inline-block">ESC</span>
                                <X size={24} className="md:hidden" />
                            </button>
                        </div>

                        {/* Trending Section */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                            <div className="flex items-center gap-2 text-primary-gold mb-4">
                                <TrendingUp size={18} className="text-coral-500" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Trending Now</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {['Little Legends', 'Sustainable', 'Gift Sets', 'Space Decor', 'Dinosaur Tee', 'Party Wear'].map((tag) => (
                                    <button
                                        key={tag}
                                        className="text-white hover:text-navy-900 bg-white/10 hover:bg-white px-4 py-2 rounded-full text-sm font-medium transition-all"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
