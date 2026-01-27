'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import GlassCard from '@/components/UI/GlassCard';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { motion } from 'framer-motion';
import { useUI } from '@/context/UIContext';
import ProductCard from '@/components/Product/ProductCard';
import { createClient } from '@/utils/supabase/client';
import { LayoutGrid } from 'lucide-react';
import BrandLoader from '@/components/UI/BrandLoader';
import { FLAT_TAXONOMY, FlatNode } from '@/data/flatTaxonomy';

// This page handles ALL levels: World, Category, and Leaf Item
export default function CollectionPage() {
    const params = useParams();
    const slug = params?.slug as string; // /collections/[slug] - Always a string

    const [node, setNode] = useState<FlatNode | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    // 1. Resolve Node from Flat Taxonomy
    useEffect(() => {
        if (!slug) return;

        const foundNode = FLAT_TAXONOMY[slug];

        if (foundNode) {
            setNode(foundNode);
        } else {
            // Check for special 'sale', 'new-arrivals', 'featured' if they were dynamic, 
            // but for now we assume they might be separate pages or handled here if allowed.
            // If strictly following the map, invalid slug = 404 or maybe a product ID fallback?
            setNode(null);
        }
        setLoading(false);
    }, [slug]);

    // 2. Fetch Products if Node is 'item' (Leaf)
    useEffect(() => {
        const fetchProducts = async () => {
            // Fetch for Item (Leaf) OR Category (Mid-level like Men/Women)
            if (node?.type === 'item' || node?.type === 'category') {
                setLoading(true);
                const targetSlug = node.data.slug;

                // 1. Get Category ID and Info
                const { data: catData, error: catError } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('slug', targetSlug)
                    .single();

                if (catError || !catData) {
                    // Fallback logic remains...
                    setLoading(false);
                    return;
                }

                let productQuery = supabase.from('products').select('*');

                if (node.type === 'item') {
                    // Leaf: Direct match
                    productQuery = productQuery.eq('category_id', catData.id);
                } else {
                    // Category: Match children items from LOCAL TAXONOMY (safer than DB parent_id)
                    // node.data.items contains the sub-categories (leafs)
                    const childSlugs = node.data.items?.map((i: any) => i.slug) || [];

                    if (childSlugs.length > 0) {
                        // Resolve all child slugs to IDs
                        const { data: childrenCats } = await supabase
                            .from('categories')
                            .select('id')
                            .in('slug', childSlugs);

                        if (childrenCats && childrenCats.length > 0) {
                            const ids = childrenCats.map((c: { id: string }) => c.id);
                            // Also include self
                            ids.push(catData.id);
                            productQuery = productQuery.in('category_id', ids);
                        } else {
                            productQuery = productQuery.eq('category_id', catData.id);
                        }
                    } else {
                        productQuery = productQuery.eq('category_id', catData.id);
                    }
                }

                const { data, error } = await productQuery;

                if (error) {
                    console.error("Error fetching products:", error);
                }
                setProducts(data || []);
                setLoading(false);
            }
        };

        if (node?.type === 'item' || node?.type === 'category') {
            fetchProducts();
        }
    }, [node]);


    if (loading) return <BrandLoader text="Loading Collection..." />;

    if (!node) {
        return (
            <div className="min-h-screen pt-[var(--header-height)] flex items-center justify-center bg-gray-50 dark:bg-navy-950">
                <div className="text-center">
                    <h2 className="text-3xl font-heading font-bold text-navy-900 dark:text-white mb-2">Collection Not Found</h2>
                    <p className="text-gray-500 mb-6">The collection you are looking for doesn't exist.</p>
                    <Link href="/" className="px-6 py-3 bg-navy-900 text-white rounded-full font-bold hover:bg-coral-500 transition-all">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    // Determine what to show
    let children: any[] = [];
    if (node.type === 'world') {
        children = node.data.subcategories || [];
    } else if (node.type === 'category') {
        children = node.data.items || [];
    }

    const showCards = children.length > 0;
    const showProducts = node.type === 'item' || node.type === 'category';

    // Dynamic Gradient based on type
    const heroGradient = node.type === 'world'
        ? 'from-blue-500/10 via-purple-500/5 to-coral-500/10'
        : 'from-emerald-500/10 via-teal-500/5 to-blue-500/10';

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-navy-950 pt-[var(--header-height)] pb-20 overflow-hidden">
            <AmbientBackground />

            {/* Background Blob */}
            <div className={`absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br ${heroGradient} blur-3xl opacity-50 pointer-events-none`} />

            {/* Breadcrumbs - Premium */}
            {(node.parent || !node.parent) && (
                <div className="relative z-40 px-6 py-4">
                    <div className="max-w-fit mx-auto px-6 py-2 bg-white/50 dark:bg-navy-900/50 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/5 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-navy-700 dark:text-gray-300 shadow-sm">
                        <Link href="/" className="hover:text-coral-500 transition-colors">Home</Link>
                        <span className="opacity-40">/</span>
                        {node.parent && (
                            <>
                                <Link href={`/collections/${node.parent.slug}`} className="hover:text-coral-500 transition-colors">{node.parent.name}</Link>
                                <span className="opacity-40">/</span>
                            </>
                        )}
                        <span className="text-coral-500">{node.data.name}</span>
                    </div>
                </div>
            )}

            {/* HERO */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-16 md:py-24 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/5 backdrop-blur-md">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-navy-900 dark:text-white/90">
                            {node.type === 'world' ? 'Collection' : node.type}
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-heading font-black text-navy-900 dark:text-white mb-6 leading-tight tracking-tight">
                        {node.data.name}
                    </h1>

                    {node.data.description && (
                        <p className="text-lg md:text-xl text-navy-800/70 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium">
                            {node.data.description}
                        </p>
                    )}
                </motion.div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">

                {/* 1. Sub-Collection Cards */}
                {showCards && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20"
                    >
                        {children.map((child: any, idx: number) => (
                            <Link key={idx} href={`/collections/${child.slug}`} className="group relative">
                                <div className="absolute inset-0 bg-coral-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <GlassCard
                                    className="relative h-full min-h-[280px] flex flex-col justify-end p-8 overflow-hidden rounded-[2rem] border-white/40 dark:border-white/5 bg-white/40 dark:bg-navy-900/40 hover:bg-white/60 dark:hover:bg-navy-800/60 transition-all duration-500 transform group-hover:-translate-y-2"
                                    disableTilt
                                >
                                    {/* Abstract Decor */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/40 to-transparent opacity-20 dark:opacity-5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

                                    <div className="relative z-10">
                                        <div className="w-12 h-12 mb-6 rounded-full bg-white dark:bg-navy-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            <LayoutGrid size={20} className="text-coral-500" />
                                        </div>

                                        <h3 className="text-3xl font-heading font-bold text-navy-900 dark:text-white mb-2 leading-none group-hover:text-coral-500 transition-colors">
                                            {child.name}
                                        </h3>

                                        <div className="flex items-center justify-between mt-4 border-t border-navy-900/5 dark:border-white/5 pt-4">
                                            <p className="text-xs font-bold uppercase tracking-widest text-navy-500 dark:text-gray-400 opacity-80">
                                                {child.description || 'Collection'}
                                            </p>
                                            <span className="w-8 h-8 rounded-full bg-navy-900 dark:bg-white text-white dark:text-navy-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>
                        ))}
                    </motion.div>
                )}

                {/* 2. Products */}
                {showProducts && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                            {products.length > 0 ? products.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * idx }}
                                >
                                    <ProductCard
                                        id={product.id}
                                        name={product.name}
                                        brand="BroncStudio"
                                        price={product.price}
                                        originalPrice={product.compare_at_price}
                                        image={product.images?.[0] || product.image_url || '/images/placeholder.jpg'}
                                        badge={product.stock_status === 'out_of_stock' ? 'Sold Out' : undefined}
                                    />
                                </motion.div>
                            )) : (
                                <div className="col-span-full py-32 text-center text-gray-400">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <LayoutGrid size={32} className="opacity-50" />
                                    </div>
                                    <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">No Products Found</h3>
                                    <p>We couldn't find any items in this collection just yet.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
