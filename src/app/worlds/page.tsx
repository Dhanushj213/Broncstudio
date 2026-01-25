'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassCard from '@/components/UI/GlassCard';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { Sparkles, Zap, Star, ChevronRight, LayoutGrid } from 'lucide-react';

// --- INTERFACES & DATA ---

interface CatalogItem {
    name: string;
    href: string;
    badge?: string;
    badgeColor?: 'pink' | 'blue' | 'gold' | 'green' | 'purple' | 'orange';
}

interface SubCategory {
    title: string;
    items: CatalogItem[];
}

interface Category {
    title: string;
    description?: string;
    colSpan?: string; // Tailwind class for grid span (e.g. md:col-span-12)
    subGridCols?: string; // Tailwind class for internal grid (e.g. md:grid-cols-4)
    gradient?: string;
    subcategories: SubCategory[];
}

const CATALOG: Category[] = [
    {
        title: "KIDS & LEARNING",
        gradient: "from-blue-500 to-indigo-600",
        colSpan: "md:col-span-12",
        subGridCols: "md:grid-cols-4",
        description: "Curiosity & Play",
        subcategories: [
            {
                title: "Books",
                items: [
                    { name: "Kids Story Books", href: "/shop/tiny-tales", badge: "Classic", badgeColor: "gold" },
                    { name: "Kids Colouring Books", href: "/shop/colouring-books", badge: "New", badgeColor: "green" }
                ]
            },
            {
                title: "Stationery",
                items: [
                    { name: "Sketchbook", href: "/shop/creative-sketches" },
                    { name: "Notebook", href: "/shop/notebook" },
                    { name: "Daily Planner", href: "/shop/planner", badge: "Hot", badgeColor: "pink" },
                    { name: "Notepad", href: "/shop/notepad" }
                ]
            },
            {
                title: "Paper Accessories",
                items: [
                    { name: "Bookmark", href: "/shop/bookmark" },
                    { name: "Postcards", href: "/shop/postcards" },
                    { name: "Greeting Cards", href: "/shop/greeting-cards" }
                ]
            },
            {
                title: "Toys & Activities",
                items: [
                    { name: "MDF Puzzles", href: "/shop/brain-builders" },
                    { name: "Jigsaw Puzzle", href: "/shop/jigsaw" },
                    { name: "Tattoos", href: "/shop/tattoos", badge: "Fun", badgeColor: "blue" },
                    { name: "Stickers", href: "/shop/stickers" },
                    { name: "Ornaments", href: "/shop/ornaments" }
                ]
            }
        ]
    },
    {
        title: "CLOTHING",
        colSpan: "md:col-span-12",
        subGridCols: "md:grid-cols-3",
        gradient: "from-rose-500 to-orange-600",
        description: "Apparel for All",
        subcategories: [
            {
                title: "Men",
                items: [
                    { name: "Classic Crew", href: "/shop/men-classic-tees" },
                    { name: "Oversized Tee", href: "/shop/men-oversized-tees", badge: "Trending", badgeColor: "pink" },
                    { name: "Polos", href: "/shop/men-polos" },
                    { name: "Hoodies", href: "/shop/men-hoodies", badge: "Winter", badgeColor: "blue" },
                    { name: "Jackets", href: "/shop/men-jackets" },
                    { name: "Bottoms", href: "/shop/men-bottoms" }
                ]
            },
            {
                title: "Women",
                items: [
                    { name: "Tops & Tees", href: "/shop/women-tops" },
                    { name: "Dresses", href: "/shop/women-dresses" },
                    { name: "Bottom Wear", href: "/shop/women-bottoms" },
                    { name: "Activewear", href: "/shop/women-active", badge: "Pro", badgeColor: "green" },
                    { name: "Outerwear", href: "/shop/women-outerwear" }
                ]
            },
            {
                title: "Kids",
                items: [
                    { name: "Boys Tees", href: "/shop/little-champ-tee" },
                    { name: "Girls Tees", href: "/shop/tiny-trend-tee" },
                    { name: "Rompers", href: "/shop/kids-rompers", badge: "Cute", badgeColor: "pink" },
                    { name: "Winter Wear", href: "/shop/kids-winter" }
                ]
            }
        ]
    },
    {
        title: "ACCESSORIES",
        colSpan: "md:col-span-3",
        gradient: "from-purple-500 to-pink-600",
        description: "Style Extras",
        subcategories: [
            {
                title: "Headwear",
                items: [
                    { name: "Caps", href: "/shop/caps", badge: "Best", badgeColor: "gold" },
                    { name: "Snapbacks", href: "/shop/snapbacks" },
                    { name: "Bucket Hats", href: "/shop/bucket-hats" }
                ]
            },
            {
                title: "Wearables",
                items: [
                    { name: "Scarves", href: "/shop/scarves" },
                    { name: "Scrunchies", href: "/shop/scrunchies" },
                    { name: "Aprons", href: "/shop/aprons" }
                ]
            }
        ]
    },
    {
        title: "TECH & DESK",
        colSpan: "md:col-span-3",
        gradient: "from-cyan-500 to-blue-600",
        description: "Workspace",
        subcategories: [
            {
                title: "Cases",
                items: [
                    { name: "iPhone", href: "/shop/iphone-cases", badge: "New", badgeColor: "gold" },
                    { name: "Samsung", href: "/shop/samsung-cases" },
                    { name: "OnePlus", href: "/shop/oneplus-cases" }
                ]
            },
            {
                title: "Desk",
                items: [
                    { name: "Mouse Pads", href: "/shop/mouse-pads" },
                    { name: "Gaming Pads", href: "/shop/gaming-pads" }
                ]
            }
        ]
    },
    {
        title: "HOME & DECOR",
        colSpan: "md:col-span-3",
        gradient: "from-emerald-500 to-teal-600",
        description: "Decor",
        subcategories: [
            {
                title: "Wall",
                items: [
                    { name: "Posters", href: "/shop/posters" },
                    { name: "Canvas", href: "/shop/canvas" }
                ]
            },
            {
                title: "Living",
                items: [
                    { name: "Coasters", href: "/shop/coasters" },
                    { name: "Cushions", href: "/shop/cushions" },
                    { name: "Magnets", href: "/shop/magnets" }
                ]
            }
        ]
    },
    {
        title: "DRINKWARE",
        colSpan: "md:col-span-3",
        gradient: "from-amber-500 to-orange-600",
        description: "Sip in Style",
        subcategories: [
            {
                title: "Mugs",
                items: [
                    { name: "Coffee Mugs", href: "/shop/mugs" },
                    { name: "Magic Mugs", href: "/shop/magic-mugs" }
                ]
            },
            {
                title: "Bottles",
                items: [
                    { name: "Steel Bottles", href: "/shop/bottles" },
                    { name: "Sippers", href: "/shop/sippers" }
                ]
            }
        ]
    },
    {
        title: "BAGS",
        colSpan: "md:col-span-4",
        gradient: "from-indigo-500 to-purple-600",
        description: "Carry Essentials",
        subcategories: [
            {
                title: "Daily",
                items: [
                    { name: "Tote Bags (Zip)", href: "/shop/totes-zipper", badge: "Must Have", badgeColor: "blue" },
                    { name: "Large Totes", href: "/shop/totes-large" },
                    { name: "Drawstrings", href: "/shop/drawstring-bags" }
                ]
            }
        ]
    },
    {
        title: "GIFTS",
        colSpan: "md:col-span-4",
        gradient: "from-pink-500 to-rose-600",
        description: "Small Joys",
        subcategories: [
            {
                title: "Trinkets",
                items: [
                    { name: "Keychains", href: "/shop/keychains" },
                    { name: "Badges", href: "/shop/badges" }
                ]
            },
            {
                title: "Tags",
                items: [
                    { name: "Luggage Tags", href: "/shop/luggage-tags" },
                    { name: "Patches", href: "/shop/patches" }
                ]
            }
        ]
    },
    {
        title: "PETS",
        colSpan: "md:col-span-4",
        gradient: "from-lime-500 to-green-600",
        description: "Furry Friends",
        subcategories: [
            {
                title: "Essentials",
                items: [
                    { name: "Dog Tees", href: "/shop/dog-tees", badge: "Cute", badgeColor: "orange" },
                    { name: "Pet Tags", href: "/shop/pet-tags" }
                ]
            }
        ]
    }
];

// --- COMPONENTS ---

const GlowingBadge = ({ text, color = 'blue' }: { text: string, color?: CatalogItem['badgeColor'] }) => {
    const colorMap = {
        pink: 'bg-pink-500',
        blue: 'bg-blue-500',
        gold: 'bg-amber-500',
        green: 'bg-emerald-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
    };

    const styles = colorMap[color as keyof typeof colorMap] || colorMap.blue;

    return (
        <span className={`inline-flex items-center px-1.5 py-[2px] rounded-sm text-[8px] font-bold uppercase tracking-wider text-white shadow-sm ml-2 ${styles}`}>
            {text}
        </span>
    );
};

// --- MAIN PAGE ---

export default function WorldsPage() {
    return (
        <main className="relative min-h-screen pt-[var(--header-height)] pb-24 overflow-hidden selection:bg-coral-500/30">
            <AmbientBackground />

            {/* Technical Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06]"
                style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="relative z-10 container-premium max-w-[1400px] mx-auto px-6">

                {/* Header */}
                <div className="py-12 flex flex-col md:flex-row items-end justify-between gap-6 border-b border-navy-900/10 dark:border-white/10 mb-8 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-coral-500">
                            <LayoutGrid size={14} />
                            <span>Product Matrix</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-heading font-black text-navy-900 dark:text-white tracking-tight">
                            CATALOG <span className="text-gray-300 dark:text-white/20">///</span>
                        </h1>
                    </div>
                </div>

                {/* COMPACT DENSE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {CATALOG.map((category) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className={`${category.colSpan || 'md:col-span-3'} flex flex-col`}
                        >
                            <GlassCard
                                className="h-full group hover:border-gray-400 dark:hover:border-white/30 transition-all duration-300 overflow-visible bg-white/70 dark:bg-navy-900/60"
                                disableTilt
                            >
                                {/* Header */}
                                <div className="p-4 border-b border-navy-900/5 dark:border-white/5 flex items-center justify-between bg-white/40 dark:bg-black/20">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${category.gradient}`} />
                                        <div>
                                            <h2 className="text-xl font-bold text-navy-900 dark:text-white tracking-tight leading-none">
                                                {category.title}
                                            </h2>
                                            {category.description && (
                                                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                    {category.description}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Sparkles size={14} className="text-gray-300 dark:text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* Content Grid */}
                                <div className={`p-4 grid gap-6 ${category.subGridCols || 'grid-cols-1'}`}>
                                    {category.subcategories.map((sub) => (
                                        <div key={sub.title} className="space-y-2">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-dashed border-gray-200 dark:border-white/10 pb-1 mb-2">
                                                {sub.title}
                                            </h3>
                                            <ul className="space-y-1">
                                                {sub.items.map((item) => (
                                                    <li key={item.name}>
                                                        <Link
                                                            href={item.href}
                                                            className="block py-1 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-navy-900 dark:hover:text-white hover:translate-x-1 transition-all duration-200"
                                                        >
                                                            <div className="flex items-center flex-wrap gap-1">
                                                                {item.name}
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="mt-16 text-center border-t border-navy-900/10 dark:border-white/10 pt-8">
                    <Link
                        href="/gift-finder"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 dark:bg-white text-white dark:text-navy-900 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 hover:shadow-lg transition-all duration-300"
                    >
                        <Star size={16} className="fill-current" />
                        Find the Perfect Gift
                    </Link>
                </div>

            </div>
        </main>
    );
}
