'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

interface BentoTile {
    title: string;
    subtitle: string;
    href: string;
    image: string;
    colSpan: string;
    rowSpan: string;
    color: string;
    textColor: string;
}

const DEFAULT_TILES: BentoTile[] = [
    {
        title: 'Clothing',
        subtitle: 'Trending',
        href: '/shop/clothing',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
        colSpan: 'col-span-6 md:col-span-3',
        rowSpan: 'row-span-1',
        color: 'bg-green-100',
        textColor: 'text-green-900',
    },
    {
        title: 'Women',
        subtitle: 'For Her',
        href: '/shop/clothing/women',
        image: 'https://images.unsplash.com/photo-1525845859779-54d477ff291f?w=600&q=80',
        colSpan: 'col-span-6 md:col-span-3',
        rowSpan: 'row-span-2',
        color: 'bg-orange-50',
        textColor: 'text-orange-900',
    },
    {
        title: 'Stationery & Play',
        subtitle: 'Curiosity',
        href: '/shop/kids',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
        colSpan: 'col-span-6 md:col-span-3',
        rowSpan: 'row-span-1',
        color: 'bg-blue-50',
        textColor: 'text-blue-900',
    },
    {
        title: 'Accessories',
        subtitle: 'Extras',
        href: '/shop/accessories',
        image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&q=80',
        colSpan: 'col-span-6 md:col-span-3',
        rowSpan: 'row-span-1',
        color: 'bg-purple-100',
        textColor: 'text-purple-900',
    },
    {
        title: 'Men',
        subtitle: 'Menswear',
        href: '/shop/clothing/men',
        image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80',
        colSpan: 'col-span-6 md:col-span-3',
        rowSpan: 'row-span-1',
        color: 'bg-stone-100',
        textColor: 'text-stone-900',
    },
    {
        title: 'Pets',
        subtitle: 'Furry Friends',
        href: '/shop/pets',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
        colSpan: 'col-span-6 md:col-span-3',
        rowSpan: 'row-span-1',
        color: 'bg-amber-100',
        textColor: 'text-amber-900',
    },
    {
        title: 'Lifestyle',
        subtitle: 'Small Joys',
        href: '/shop/lifestyle',
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80',
        colSpan: 'col-span-6 md:col-span-3',
        rowSpan: 'row-span-1',
        color: 'bg-rose-50',
        textColor: 'text-rose-900',
    },
    {
        title: 'Home',
        subtitle: 'Decor',
        href: '/shop/home',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        colSpan: 'col-span-12',
        rowSpan: 'row-span-1',
        color: 'bg-indigo-100',
        textColor: 'text-indigo-900',
    }
];

export default function DepartmentBentoGrid() {
    const [tiles, setTiles] = useState<BentoTile[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchTiles() {
            try {
                const { data, error } = await supabase
                    .from('content_blocks')
                    .select('content')
                    .eq('section_id', 'bento_grid')
                    .single();

                if (data && data.content && Array.isArray(data.content.tiles)) {
                    setTiles(data.content.tiles);
                } else {
                    setTiles(DEFAULT_TILES);
                }
            } catch (err) {
                console.error('Error fetching bento grid tiles:', err);
                setTiles(DEFAULT_TILES);
            } finally {
                setLoading(false);
            }
        }

        fetchTiles();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="animate-spin text-coral-500" size={32} />
            </div>
        );
    }

    return (
        <section className="relative z-10 max-w-[1200px] mx-auto px-6 py-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-12 gap-4 pb-4 auto-rows-[200px] md:grid-rows-3 md:gap-[20px] md:h-[840px] md:pb-0"
            >
                <AnimatePresence>
                    {tiles.map((tile, index) => (
                        <motion.div
                            key={tile.title + index}
                            variants={itemVariants}
                            className={`relative group rounded-3xl overflow-hidden cursor-pointer
                                ${tile.colSpan} ${tile.rowSpan}
                                h-full w-full
                                ${tile.color}
                            `}
                        >
                            <Link href={tile.href} className="block h-full w-full relative z-10">
                                <div className="absolute inset-0">
                                    <img
                                        src={getGoogleDriveDirectLink(tile.image)}
                                        alt={tile.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-90" />
                                </div>

                                <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end text-white">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1 md:space-y-2">
                                            <div className="inline-block px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase bg-white/20 backdrop-blur-md rounded-full mb-1 md:mb-2">
                                                {tile.subtitle}
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-heading font-medium leading-none drop-shadow-lg">
                                                {tile.title}
                                            </h2>
                                        </div>
                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform group-hover:-rotate-45 transition-all duration-500 shadow-xl group-hover:bg-red-600 group-hover:text-black active:scale-95 border border-white/30">
                                            <ArrowUpRight size={16} strokeWidth={1.5} className="md:w-6 md:h-6 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
