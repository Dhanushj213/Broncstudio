'use client';

import React from 'react';
import { ChevronDown, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'alpha-asc' | 'alpha-desc';

interface SortBarProps {
    totalProducts: number;
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
    viewMode?: 'grid' | 'list';
    onViewModeChange?: (mode: 'grid' | 'list') => void;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
    { label: 'Featured', value: 'featured' },
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Alphabetical: A-Z', value: 'alpha-asc' },
    { label: 'Alphabetical: Z-A', value: 'alpha-desc' },
];

export default function SortBar({
    totalProducts,
    sortOption,
    onSortChange,
    viewMode = 'grid',
    onViewModeChange
}: SortBarProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close on click outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = SORT_OPTIONS.find(o => o.value === sortOption)?.label || 'Featured';

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 mb-6 border-b border-gray-100 dark:border-white/5">
            {/* Count */}
            <p className="text-sm text-gray-500 font-medium">
                Showing <span className="text-navy-900 dark:text-white font-bold">{totalProducts}</span> products
            </p>

            {/* Controls */}
            <div className="flex items-center gap-4">
                {/* View Mode */}
                {onViewModeChange && (
                    <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-navy-800 rounded-lg">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-navy-700 shadow text-navy-900 dark:text-white' : 'text-gray-400 hover:text-navy-900'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-navy-700 shadow text-navy-900 dark:text-white' : 'text-gray-400 hover:text-navy-900'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                )}

                {/* Sort Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 text-sm font-bold text-navy-900 dark:text-white hover:text-coral-500 transition-colors"
                    >
                        {selectedLabel}
                        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute left-0 sm:right-0 top-full mt-2 w-48 bg-white dark:bg-navy-800 rounded-xl shadow-xl border border-gray-100 dark:border-white/5 z-50 overflow-hidden"
                            >
                                <ul className="py-2">
                                    {SORT_OPTIONS.map((opt) => (
                                        <li key={opt.value}>
                                            <button
                                                onClick={() => {
                                                    onSortChange(opt.value);
                                                    setIsOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${sortOption === opt.value
                                                    ? 'bg-navy-50 dark:bg-navy-700 text-coral-500'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
