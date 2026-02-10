'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import clsx from 'clsx'; // Using clsx as it is in package.json

interface FilterSidebarProps {
    products: any[];
    activeFilters: {
        minPrice: number;
        maxPrice: number;
        colors: string[];
        sizes: string[];
        brands: string[];
    };
    onFilterChange: (newFilters: any) => void;
    className?: string;
}

export default function FilterSidebar({ products, activeFilters, onFilterChange, className }: FilterSidebarProps) {
    // 1. Extract Available Options (Memoize in real app, but fast enough here)
    const brands = Array.from(new Set(products.map(p => p.brand).filter((b): b is string => typeof b === 'string' && b.length > 0))).sort();

    // Extract colors/sizes from metadata
    const colors = Array.from(new Set(products.flatMap(p => p.metadata?.colors || []).filter((c): c is string => typeof c === 'string'))).sort();
    const sizes = Array.from(new Set(products.flatMap(p => p.metadata?.sizes || []).filter((s): s is string => typeof s === 'string'))).sort();

    // Price Bounds
    const prices = products.map(p => p.price);
    const globalMin = prices.length ? Math.min(...prices) : 0;
    const globalMax = prices.length ? Math.max(...prices) : 10000;

    // Local state for collapsed sections (default all open)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        price: true,
        color: true,
        size: true,
        brand: true,
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Hanlders
    const toggleArrayFilter = (key: 'colors' | 'sizes' | 'brands', value: string) => {
        const current = activeFilters[key];
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];

        onFilterChange({ ...activeFilters, [key]: updated });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        const val = Number(e.target.value);
        onFilterChange({
            ...activeFilters,
            [type === 'min' ? 'minPrice' : 'maxPrice']: val
        });
    };

    return (
        <aside className={clsx("w-full", className)}>
            <div className="space-y-6">

                {/* 1. Price Filter */}
                <div className="border-b border-gray-200 dark:border-white/10 pb-6">
                    <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between text-sm font-bold uppercase tracking-wider text-navy-900 dark:text-white mb-4">
                        <span>Price</span>
                        {openSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <AnimatePresence>
                        {openSections.price && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={activeFilters.minPrice || ''}
                                            placeholder={String(globalMin)}
                                            onChange={(e) => handlePriceChange(e, 'min')}
                                            className="w-full pl-6 pr-2 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm"
                                        />
                                    </div>
                                    <span className="text-gray-400">-</span>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={activeFilters.maxPrice || ''}
                                            placeholder={String(globalMax)}
                                            onChange={(e) => handlePriceChange(e, 'max')}
                                            className="w-full pl-6 pr-2 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 2. Color Filter */}
                {colors.length > 0 && (
                    <div className="border-b border-gray-200 dark:border-white/10 pb-6">
                        <button onClick={() => toggleSection('color')} className="w-full flex items-center justify-between text-sm font-bold uppercase tracking-wider text-navy-900 dark:text-white mb-4">
                            <span>Color</span>
                            {openSections.color ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <AnimatePresence>
                            {openSections.color && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((color: any) => {
                                            const isActive = activeFilters.colors.includes(color);
                                            // Simple logic to map color name to CSS
                                            const bg = color.toLowerCase().replace(' ', '');
                                            return (
                                                <button
                                                    key={color}
                                                    onClick={() => toggleArrayFilter('colors', color)}
                                                    className={clsx(
                                                        "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                                                        isActive ? "ring-2 ring-offset-2 ring-navy-900 dark:ring-white scale-110" : "border-gray-200 hover:scale-105"
                                                    )}
                                                    style={{ backgroundColor: bg }}
                                                    title={color}
                                                >
                                                    {isActive && <Check size={12} className={clsx(bg === 'white' ? "text-black" : "text-white")} />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 3. Size Filter */}
                {sizes.length > 0 && (
                    <div className="border-b border-gray-200 dark:border-white/10 pb-6">
                        <button onClick={() => toggleSection('size')} className="w-full flex items-center justify-between text-sm font-bold uppercase tracking-wider text-navy-900 dark:text-white mb-4">
                            <span>Size</span>
                            {openSections.size ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <AnimatePresence>
                            {openSections.size && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                    <div className="grid grid-cols-3 gap-2">
                                        {sizes.map((size: any) => {
                                            const isActive = activeFilters.sizes.includes(size);
                                            return (
                                                <button
                                                    key={size}
                                                    onClick={() => toggleArrayFilter('sizes', size)}
                                                    className={clsx(
                                                        "py-2 text-xs font-medium rounded-md border transition-all",
                                                        isActive
                                                            ? "bg-navy-900 text-white border-navy-900 dark:bg-white dark:text-slate-900"
                                                            : "bg-transparent border-gray-200 text-gray-600 hover:border-navy-900 dark:border-white/10 dark:text-gray-300 dark:hover:border-white"
                                                    )}
                                                >
                                                    {size}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 4. Brand Filter */}
                {brands.length > 0 && (
                    <div className="border-b border-gray-200 dark:border-white/10 pb-6">
                        <button onClick={() => toggleSection('brand')} className="w-full flex items-center justify-between text-sm font-bold uppercase tracking-wider text-navy-900 dark:text-white mb-4">
                            <span>Brand</span>
                            {openSections.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <AnimatePresence>
                            {openSections.brand && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                    <div className="space-y-2">
                                        {brands.map((brand: any) => {
                                            const isActive = activeFilters.brands.includes(brand);
                                            return (
                                                <div key={brand} className="flex items-center">
                                                    <button
                                                        onClick={() => toggleArrayFilter('brands', brand)}
                                                        className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 hover:text-navy-900 dark:hover:text-white group"
                                                    >
                                                        <div className={clsx(
                                                            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                            isActive ? "bg-navy-900 border-navy-900 dark:bg-coral-500 dark:border-coral-500 text-white" : "border-gray-300 dark:border-white/20 group-hover:border-navy-900"
                                                        )}>
                                                            {isActive && <Check size={12} />}
                                                        </div>
                                                        <span>{brand}</span>
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Clear All */}
            <button
                onClick={() => onFilterChange({ minPrice: 0, maxPrice: 10000, colors: [], sizes: [], brands: [] })}
                className="mt-6 w-full py-3 text-sm font-bold text-gray-400 hover:text-navy-900 dark:hover:text-white transition-colors"
            >
                Clear All Filters
            </button>
        </aside>
    );
}
