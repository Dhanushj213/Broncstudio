'use client';

import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/*
  Data Structures for Filters:
  - Price: custom ranges or simple min-max inputs (using ranges for Wokiee style)
  - Colors: hex codes map
  - Sizes: string list
  - Brands: string list
*/

interface FilterSidebarProps {
    filters: Record<string, string[]>; // Current active filters
    onFilterChange: (type: string, value: string) => void;
    // We could pass available options here, but for now I'll use static data or props later
    availableColors?: { name: string; code: string }[];
    availableSizes?: string[];
    availableBrands?: string[];
}

const PRICE_RANGES = [
    '$0 - $50',
    '$50 - $100',
    '$100 - $200',
    '$200+',
];

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const DEFAULT_COLORS = [
    { name: 'Red', code: '#ef4444' },
    { name: 'Blue', code: '#3b82f6' },
    { name: 'Green', code: '#22c55e' },
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#ffffff' },
    { name: 'Pink', code: '#ec4899' },
    { name: 'Yellow', code: '#eab308' },
];

export default function FilterSidebar({
    filters,
    onFilterChange,
    availableColors = DEFAULT_COLORS,
    availableSizes = DEFAULT_SIZES,
    availableBrands = ['BroncStudio', 'Bronc Premium', 'Bronc Kids']
}: FilterSidebarProps) {

    // Helper to check if active
    const isActive = (type: string, value: string) => filters[type]?.includes(value);

    return (
        <div className="space-y-8 pr-4">

            {/* 1. Price */}
            <FilterSection title="Price">
                <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                        <label key={range} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isActive('price', range) ? 'bg-navy-900 border-navy-900' : 'bg-white border-gray-300 group-hover:border-navy-500'}`}>
                                {isActive('price', range) && <Check size={12} className="text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isActive('price', range)}
                                onChange={() => onFilterChange('price', range)}
                            />
                            <span className={`text-sm ${isActive('price', range) ? 'font-bold text-navy-900' : 'text-gray-600'}`}>
                                {range}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* 2. Color */}
            <FilterSection title="Color">
                <div className="flex flex-wrap gap-3">
                    {availableColors.map((col) => (
                        <button
                            key={col.name}
                            onClick={() => onFilterChange('color', col.name)}
                            className={`group relative w-8 h-8 rounded-full border border-gray-200 shadow-sm flex items-center justify-center transition-transform hover:scale-110 ${isActive('color', col.name) ? 'ring-2 ring-navy-900 ring-offset-2' : ''}`}
                            style={{ backgroundColor: col.code }}
                            title={col.name}
                        >
                            {col.name === 'White' && <div className="absolute inset-0 border border-gray-100 rounded-full" />}
                            {isActive('color', col.name) && (
                                <Check size={14} className={col.name === 'White' ? 'text-navy-900' : 'text-white'} />
                            )}
                        </button>
                    ))}
                </div>
            </FilterSection>

            {/* 3. Size */}
            <FilterSection title="Size">
                <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => onFilterChange('size', size)}
                            className={`min-w-[40px] h-10 px-2 rounded-lg border text-xs font-bold transition-all ${isActive('size', size)
                                ? 'bg-navy-900 text-white border-navy-900'
                                : 'bg-white text-navy-900 border-gray-200 hover:border-navy-500'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </FilterSection>

            {/* 4. Brand */}
            <FilterSection title="Brand">
                <div className="space-y-2">
                    {availableBrands.map((brand) => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isActive('brand', brand) ? 'bg-navy-900 border-navy-900' : 'bg-white border-gray-300 group-hover:border-navy-500'}`}>
                                {isActive('brand', brand) && <Check size={12} className="text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isActive('brand', brand)}
                                onChange={() => onFilterChange('brand', brand)}
                            />
                            <span className={`text-sm ${isActive('brand', brand) ? 'font-bold text-navy-900' : 'text-gray-600'}`}>
                                {brand}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>
        </div>
    );
}

// Sub-component for accordion sections
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-gray-100 pb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full mb-4 text-left"
            >
                <span className="font-heading font-bold text-navy-900 uppercase tracking-wider text-sm">{title}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
