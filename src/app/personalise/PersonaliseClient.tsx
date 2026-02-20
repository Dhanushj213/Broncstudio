'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, Search, Filter, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PERSONALIZATION_TAXONOMY } from '@/lib/personalization';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';


// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------
interface BaseProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    description: string;
    metadata: {
        product_type: string;
        personalization: any;
    };
}

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

const ProductCard = ({ product }: { product: BaseProduct }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        className="group relative bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
        <Link href={`/personalise/${product.id}`}>
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <Image
                    src={product.images[0] || 'https://placehold.co/600x800/png?text=No+Image'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Mobile Quick Action Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 lg:hidden">
                    <div className="w-full py-3 bg-white text-black font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2">
                        Customize <ArrowRight size={14} />
                    </div>
                </div>

                {/* Desktop Quick Action */}
                <div className="absolute bottom-6 left-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden lg:block">
                    <button className="w-full py-4 bg-white/95 backdrop-blur-md text-black font-black rounded-2xl shadow-2xl hover:bg-white flex items-center justify-center gap-2 transform active:scale-95 transition-transform">
                        Start Designing <Sparkles size={18} className="text-blue-600" />
                    </button>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-black text-lg text-neutral-900 dark:text-white leading-tight truncate" title={product.name}>
                        {product.name}
                    </h3>
                </div>
                <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">{product.metadata.product_type}</p>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-neutral-900 dark:text-white">₹{product.price}</span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase">Base Price</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <ChevronRight size={20} />
                    </div>
                </div>
            </div>
        </Link>
    </motion.div>
);

// ----------------------------------------------------------------------
// MAIN PAGE
// ----------------------------------------------------------------------
export default function PersonaliseListingPage() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<BaseProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<BaseProduct[]>([]);
    const [heroImage, setHeroImage] = useState<string>('https://images.unsplash.com/photo-1513346038313-05b1c5905d53?w=1600&q=80');

    // Filters
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('metadata->>type', 'personalization_base')
                .order('created_at', { ascending: false });

            if (data) {
                const shuffled = [...data];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                setProducts(shuffled);
                setFilteredProducts(shuffled);
            }

            // Fetch Hero Image
            const { data: heroData } = await supabase
                .from('content_blocks')
                .select('*')
                .eq('section_id', 'personalise_hero_image')
                .single();

            if (heroData && heroData.content?.url) {
                setHeroImage(getGoogleDriveDirectLink(heroData.content.url));
            }

            setLoading(false);
        };

        fetchProducts();
    }, []);

    // 2. Filter Logic
    useEffect(() => {
        let result = products;

        if (selectedCategory !== 'All') {
            result = result.filter(p => {
                const catConfig = PERSONALIZATION_TAXONOMY[selectedCategory as keyof typeof PERSONALIZATION_TAXONOMY];
                if (!catConfig) return false;
                // @ts-ignore
                if (catConfig.types && Array.isArray(catConfig.types)) {
                    // @ts-ignore
                    return catConfig.types.includes(p.metadata.product_type);
                }
                // @ts-ignore
                if (catConfig.subcategories) {
                    // @ts-ignore
                    const allTypes = Object.values(catConfig.types).flat();
                    return allTypes.includes(p.metadata.product_type);
                }
                return false;
            });
        }

        if (selectedSubCategory) {
            result = result.filter(p => {
                const pGenders = p.metadata.personalization?.gender_supported || [];
                const target = selectedSubCategory.toLowerCase();
                if (target === 'kids') return pGenders.includes('kids');
                return pGenders.includes(target) || pGenders.includes('unisex');
            });
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.metadata.product_type.toLowerCase().includes(q)
            );
        }

        setFilteredProducts(result);
    }, [selectedCategory, selectedSubCategory, searchQuery, products]);

    const categories = ['All', ...Object.keys(PERSONALIZATION_TAXONOMY)];

    return (
        <div className="relative min-h-screen bg-background pt-[220px] -mt-[120px] pb-20 overflow-hidden">
            <AmbientBackground />

            {/* HERO BANNER IMAGE */}
            <div className="absolute top-0 left-0 right-0 h-[400px] md:h-[500px] z-0">
                <div className="absolute inset-0 bg-black/20 dark:bg-black/50 z-10" />
                <Image
                    src={heroImage}
                    alt="Custom Studio Hero"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7] dark:from-black to-transparent z-20" />
            </div>

            {/* Background Blob */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 opacity-40 blur-3xl pointer-events-none z-0" />

            {/* Breadcrumbs */}
            <div className="relative z-40 px-6 py-4 mt-8">
                <div className="max-w-fit mx-auto px-6 py-2 bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-full border border-black/5 dark:border-white/5 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 shadow-sm">
                    <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
                    <span className="opacity-40">/</span>
                    <span className="text-blue-600">Personalise</span>
                </div>
            </div>

            {/* Hero Title & Tagline */}
            <div className="relative z-30 max-w-[1400px] mx-auto px-6 pt-4 pb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-navy-900 dark:text-white/80 mb-6 mx-auto"
                >
                    <Sparkles size={12} className="text-blue-500 dark:text-yellow-400" /> Custom Design Studio
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl lg:text-7xl font-black mb-6 tracking-tight text-navy-900 dark:text-white drop-shadow-sm dark:drop-shadow-2xl"
                >
                    Create Your <span className="text-blue-500 dark:text-blue-400">Own</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg lg:text-xl text-navy-700 dark:text-white/90 max-w-2xl mx-auto font-medium drop-shadow-sm dark:drop-shadow-lg"
                >
                    Premium custom apparel and accessories. Select a base product and make it uniquely yours.
                </motion.p>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* SIDEBAR (Desktop) */}
                    <div className="hidden lg:block w-72 flex-shrink-0 space-y-10">
                        <div className="sticky top-[calc(var(--header-height)+40px)]">
                            <h3 className="font-black text-2xl mb-6 flex items-center gap-3">
                                <Filter size={24} /> Categories
                            </h3>
                            <div className="space-y-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setSelectedSubCategory('');
                                        }}
                                        className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-black transition-all duration-300 ${selectedCategory === cat
                                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xl translate-x-1'
                                            : 'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 hover:translate-x-1'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Subcategories (Conditional Desktop) */}
                            {/* @ts-ignore */}
                            {selectedCategory !== 'All' && PERSONALIZATION_TAXONOMY[selectedCategory]?.subcategories && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mt-10 pt-10 border-t border-neutral-200 dark:border-neutral-800"
                                >
                                    <h3 className="font-black text-xs text-neutral-400 uppercase tracking-widest mb-6">Collection</h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setSelectedSubCategory('')}
                                            className={`w-full text-left px-5 py-3 rounded-xl text-sm font-black transition-colors ${!selectedSubCategory ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                                        >
                                            View All
                                        </button>
                                        {/* @ts-ignore */}
                                        {PERSONALIZATION_TAXONOMY[selectedCategory].subcategories.map((sub: string) => (
                                            <button
                                                key={sub}
                                                onClick={() => setSelectedSubCategory(sub)}
                                                className={`w-full text-left px-5 py-3 rounded-xl text-sm font-black transition-colors ${selectedSubCategory === sub
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 shadow-sm'
                                                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                                                    }`}
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1">

                        {/* SEARCH & MOBILE FILTERS (Premium Redux) */}
                        <div className="sticky top-[var(--header-height)] z-30 lg:static bg-white/50 dark:bg-black/50 backdrop-blur-xl -mx-4 px-4 py-4 lg:p-0 lg:bg-transparent lg:backdrop-blur-none lg:mb-10 lg:z-auto">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                                {/* Search Bar */}
                                <div className={`relative flex-1 group transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-blue-600 rounded-2xl' : ''}`}>
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-blue-600">
                                        <Search size={20} strokeWidth={3} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search for hoodies, t-shirts, mugs..."
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        className="w-full pl-14 pr-6 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl font-bold focus:outline-none shadow-sm transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white font-black text-xs uppercase"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>

                                {/* Horizontal Mobile Categories (Chips) */}
                                <div className="lg:hidden flex overflow-x-auto gap-2 -mx-4 px-4 pb-2 no-scrollbar">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setSelectedSubCategory('');
                                            }}
                                            className={`flex-shrink-0 px-6 py-3 rounded-full text-xs font-black transition-all whitespace-nowrap shadow-sm border ${selectedCategory === cat
                                                ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white scale-105'
                                                : 'bg-white text-neutral-500 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* PRODUCT GRID */}
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 pr-1">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="aspect-[4/5] bg-neutral-200 dark:bg-neutral-900 rounded-3xl animate-pulse" />
                                    ))}
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 pr-1"
                                >
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-24 lg:py-32"
                                >
                                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-900 mb-8">
                                        <Search size={40} className="text-neutral-300" />
                                    </div>
                                    <h3 className="text-3xl font-black text-neutral-900 dark:text-white mb-4">No Designs Found</h3>
                                    <p className="text-neutral-500 mb-10 max-w-sm mx-auto font-medium">We couldn't find any products matching your current filters. Try picking another category!</p>
                                    <button
                                        onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setSelectedSubCategory(''); }}
                                        className="px-10 py-4 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-2xl font-black shadow-xl hover:-translate-y-1 transition-all"
                                    >
                                        Clear All Filters
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
