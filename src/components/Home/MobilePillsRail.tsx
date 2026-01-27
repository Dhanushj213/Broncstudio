'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORY_TAXONOMY } from '@/data/categories';

// 1. Definition of Fixed/Priority Items
const PRIORITY_ITEMS = [
    { label: 'Hoodies', href: '/shop/men-hoodies' },
    { label: 'Jackets', href: '/shop/men-jackets' },
    { label: 'Oversized T-Shirts', href: '/shop/men-oversized-tees' },
    { label: 'Joggers', href: '/shop/men-bottoms' },
];

// 2. Helper to flatten all categories
const getAllCategories = () => {
    const allItems: { label: string; href: string }[] = [];
    const seenLabels = new Set(PRIORITY_ITEMS.map(i => i.label.toLowerCase()));

    Object.values(CATEGORY_TAXONOMY).forEach((cat: any) => {
        // Check subcategories
        if (cat.subcategories) {
            cat.subcategories.forEach((sub: any) => {
                if (sub.items) {
                    sub.items.forEach((item: any) => {
                        const label = item.name;
                        // Avoid duplicates
                        if (!seenLabels.has(label.toLowerCase())) {
                            seenLabels.add(label.toLowerCase());
                            allItems.push({
                                label: item.name,
                                href: `/shop/${item.slug}`
                            });
                        }
                    });
                }
            });
        }
        // Check groups (like in Everyday Icons)
        if (cat.groups) {
            cat.groups.forEach((group: any) => {
                if (group.subcategories) {
                    group.subcategories.forEach((sub: any) => {
                        if (sub.items) {
                            sub.items.forEach((item: any) => {
                                const label = item.name;
                                if (!seenLabels.has(label.toLowerCase())) {
                                    seenLabels.add(label.toLowerCase());
                                    allItems.push({
                                        label: item.name,
                                        href: `/shop/${item.slug}`
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    return allItems;
};

export default function MobilePillsRail() {
    const dynamicCategories = getAllCategories();
    const FULL_LIST = [...PRIORITY_ITEMS, ...dynamicCategories];

    return (
        <div className="md:hidden w-full bg-white dark:bg-navy-900 py-3 border-b border-gray-100 dark:border-white/5 sticky top-[var(--header-height)] z-20 shadow-sm">
            <div className="overflow-x-auto no-scrollbar w-full snap-x scroll-pl-4">
                <div
                    className="flex w-max min-w-full items-center"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                >
                    <div className="flex gap-2">
                        {FULL_LIST.map((item, idx) => (
                            <Link
                                key={`${item.label}-${idx}`}
                                href={item.href}
                                className="flex-shrink-0 snap-start bg-white dark:bg-navy-800 text-navy-900 dark:text-white border border-gray-200 dark:border-white/10 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
