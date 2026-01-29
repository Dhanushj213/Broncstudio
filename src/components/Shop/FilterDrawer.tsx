'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import { useUI } from '@/context/UIContext'; // Standard UI context if available or prop

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    products: any[];
    activeFilters: any;
    onFilterChange: (filters: any) => void;
}

export default function FilterDrawer({ isOpen, onClose, products, activeFilters, onFilterChange }: FilterDrawerProps) {
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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[400px] bg-white dark:bg-navy-950 shadow-2xl z-50 lg:hidden overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-heading font-bold text-navy-900 dark:text-white flex items-center gap-2">
                                    <Filter size={20} />
                                    Filters
                                </h2>
                                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <FilterSidebar
                                products={products}
                                activeFilters={activeFilters}
                                onFilterChange={onFilterChange}
                            />

                            <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-navy-950 pt-4 pb-8 border-t border-gray-100 dark:border-white/5 mt-8">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-navy-900 text-white rounded-full font-bold shadow-lg hover:bg-coral-500 transition-colors"
                                >
                                    Show Results
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
