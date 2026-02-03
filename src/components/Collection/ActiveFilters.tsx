'use client';

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActiveFiltersProps {
    filters: Record<string, string[]>; // key -> array of values
    onRemove: (key: string, value: string) => void;
    onClearAll: () => void;
}

export default function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
    // Flatten filters to list of {key, value}
    const activeList: { key: string; value: string }[] = [];
    Object.entries(filters).forEach(([key, values]) => {
        values.forEach(val => activeList.push({ key, value: val }));
    });

    if (activeList.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mr-2">Active Filters:</span>

            <AnimatePresence>
                {activeList.map(({ key, value }) => (
                    <motion.button
                        key={`${key}-${value}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => onRemove(key, value)}
                        className="group flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white rounded-full text-xs font-bold shadow-sm hover:bg-coral-500 transition-colors"
                    >
                        <span>{value}</span>
                        <X size={12} className="group-hover:scale-110 transition-transform" />
                    </motion.button>
                ))}
            </AnimatePresence>

            <button
                onClick={onClearAll}
                className="text-xs font-bold text-gray-500 hover:text-coral-500 underline ml-2 transition-colors"
            >
                Clear All
            </button>
        </div>
    );
}
