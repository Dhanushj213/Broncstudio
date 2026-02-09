'use client';

import React, { useEffect, useRef } from 'react';
import { useUI } from '@/context/UIContext';
import { Search, X, TrendingUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

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

    const router = useRouter();

    const handleSearch = (query: string) => {
        if (!query.trim()) return;
        closeSearch();
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(inputRef.current?.value || '');
        }
    };

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1100] bg-white/95 dark:bg-black/95 backdrop-blur-xl flex items-start justify-center pt-20 md:pt-32"
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
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-navy-900 dark:text-white" size={24} />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search for products, brands, or stories..."
                                className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl py-6 pl-16 pr-16 text-xl text-navy-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-black focus:border-gray-300 dark:focus:border-white/30 focus:ring-1 focus:ring-gray-200 dark:focus:ring-white/20 shadow-sm focus:shadow-xl transition-all"
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                onClick={closeSearch}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-900 dark:hover:text-white transition-colors"
                            >
                                <span className="text-xs uppercase font-bold border border-gray-300 dark:border-gray-600 px-2 py-1 rounded hidden md:inline-block">ESC</span>
                                <X size={24} className="md:hidden" />
                            </button>
                        </div>

                        {/* Trending Section */}
                        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp size={18} className="text-coral-500" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-navy-900 dark:text-white">Trending Now</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {['Oversized Tees', 'Hoodies', 'Caps', 'Tote Bags', 'Daily Planners', 'iPhone Cases'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => handleSearch(tag)}
                                        className="text-navy-900 dark:text-white hover:text-white bg-gray-100 dark:bg-white/10 hover:bg-navy-900 dark:hover:bg-white/20 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-lg"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Suggestions Section */}
                        <div className="mt-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 px-1">Suggestions</h3>
                            <div className="flex flex-wrap gap-2">
                                {(() => {
                                    const suggestions = [
                                        'Fridge Magnets', 'Pet Tags', 'Colouring Books', 'Posters',
                                        'Tote Bags', 'Mouse Pads', 'Gaming Pads', 'Coffee Mugs',
                                        'Badges', 'Dog Tees'
                                    ];
                                    // Shuffle using a simple random sort for display variety
                                    return suggestions.sort(() => Math.random() - 0.5).map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => handleSearch(item)}
                                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-navy-900 dark:hover:text-white bg-gray-50 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            {item}
                                        </button>
                                    ));
                                })()}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
