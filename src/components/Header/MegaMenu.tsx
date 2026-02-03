'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { DEPARTMENT_TAXONOMY } from '@/data/categories';

interface MegaMenuProps {
    activeDepartment: string | null;
    onClose: () => void;
}

export default function MegaMenu({ activeDepartment, onClose }: MegaMenuProps) {
    if (!activeDepartment) return null;

    const department = DEPARTMENT_TAXONOMY[activeDepartment as keyof typeof DEPARTMENT_TAXONOMY];
    if (!department) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-full w-full bg-white dark:bg-navy-900 border-b border-gray-100 dark:border-white/10 shadow-xl z-50 pt-8 pb-12"
                onMouseLeave={onClose}
            >
                <div className="container-premium max-w-[1400px] mx-auto px-6">
                    <div className="flex gap-12">
                        {/* Featured / Introduction Column */}
                        <div className="w-64 flex-shrink-0">
                            <h3 className={`text-2xl font-heading font-bold text-${department.color}-500 mb-4`}>
                                {department.label}
                            </h3>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                Explore our curated collection of {department.label.toLowerCase()}.
                            </p>
                            <Link
                                href={department.href}
                                className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-navy-900 dark:text-white hover:text-${department.color}-500 transition-colors`}
                                onClick={onClose}
                            >
                                View All <ChevronRight size={14} />
                            </Link>
                        </div>

                        {/* Grid of Groups */}
                        <div className="flex-1 grid grid-cols-3 gap-8 border-l border-gray-100 dark:border-white/5 pl-12">
                            {department.groups.map((group, idx) => (
                                <div key={idx}>
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-navy-900 dark:text-gray-200 mb-6 border-l-2 border-coral-500 pl-3">
                                        {group.title}
                                    </h4>
                                    <ul className="space-y-3">
                                        {group.items.map((item, itemIdx) => (
                                            <li key={itemIdx}>
                                                <Link
                                                    href={item.href}
                                                    onClick={onClose}
                                                    className="group flex items-center justify-between text-base text-gray-500 hover:text-navy-900 dark:hover:text-white transition-colors"
                                                >
                                                    <span>{item.label}</span>
                                                    {item.badge && (
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${item.badge === 'New' ? 'bg-green-500' :
                                                                item.badge === 'Sale' ? 'bg-red-500' :
                                                                    'bg-blue-500'
                                                            }`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
