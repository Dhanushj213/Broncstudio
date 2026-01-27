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
            <div className="min-h-screen pt-[var(--header-height)] flex items-center justify-center bg-background">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-navy-900 mb-2">Collection Not Found</h2>
                    <Link href="/" className="text-coral-500 hover:underline">Return Home</Link>
                </div>
            </div>
        );
    }

    // Determine what to show
    // World -> show subcategories (found in node.data.subcategories)
    // Category -> show items (found in node.data.items)
    // Item -> show products (fetched above)

    let children = [];
    if (node.type === 'world') {
        children = node.data.subcategories || [];
    } else if (node.type === 'category') {
        children = node.data.items || [];
    }

    const showCards = children.length > 0;
    const showProducts = node.type === 'item' || node.type === 'category';

    return (
        <div className="relative min-h-screen pt-[var(--header-height)] pb-20 bg-background">
            <AmbientBackground />

            {/* Breadcrumbs - Simple */}
            {node.parent && (
                <div className="sticky top-[72px] z-40 px-6 py-4 pointer-events-none">
                    <div className="max-w-fit mx-auto px-6 py-2 bg-white/70 dark:bg-navy-900/70 backdrop-blur-[18px] rounded-full shadow-sm border border-white/50 dark:border-white/10 pointer-events-auto flex items-center space-x-2 text-sm text-navy-700 dark:text-gray-300 font-medium">
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <Link href={`/collections/${node.parent.slug}`}>{node.parent.name}</Link>
                        <span>/</span>
                        <span className="text-coral-500">{node.data.name}</span>
                    </div>
                </div>
            )}

            {!node.parent && (
                <div className="sticky top-[72px] z-40 px-6 py-4 pointer-events-none">
                    <div className="max-w-fit mx-auto px-6 py-2 bg-white/70 dark:bg-navy-900/70 backdrop-blur-[18px] rounded-full shadow-sm border border-white/50 dark:border-white/10 pointer-events-auto flex items-center space-x-2 text-sm text-navy-700 dark:text-gray-300 font-medium">
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <span className="text-coral-500">{node.data.name}</span>
                    </div>
                </div>
            )}

            {/* HERO */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-12 flex flex-col justify-center text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-sm font-bold tracking-widest uppercase mb-4 text-coral-500">
                        {node.type === 'world' ? 'Collection' : node.type}
                    </div>
                    <h1 className="text-4xl md:text-[42px] font-heading font-bold text-navy-900 dark:text-white mb-4 leading-tight">
                        {node.data.name}
                    </h1>
                    {node.data.description && (
                        <p className="text-[16px] text-gray-600 dark:text-gray-400 max-w-[520px] mx-auto leading-relaxed">
                            {node.data.description}
                        </p>
                    )}
                </motion.div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6">

                {/* 1. Sub-Collection Cards */}
                {showCards && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-12">
                        {children.map((child: any) => (
                            <Link key={child.slug} href={`/collections/${child.slug}`} className="block group">
                                <GlassCard className="h-[200px] flex flex-col justify-center items-center text-center p-6 bg-white/72 dark:bg-navy-800/60 backdrop-blur-[18px] group-hover:border-coral-500/50 transition-all group-hover:shadow-lg">
                                    <h3 className="text-2xl font-heading text-navy-900 dark:text-white mb-2">{child.name}</h3>
                                    {child.description && <p className="text-[10px] text-navy-800/60 dark:text-gray-400 font-bold uppercase tracking-wider mb-4 opacity-70 group-hover:opacity-100">{child.description}</p>}
                                    <span className="text-sm text-coral-500 font-bold group-hover:translate-x-1 transition-transform">Browse &rarr;</span>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                )}

                {/* 2. Products */}
                {showProducts && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px]">
                        {products.length > 0 ? products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                brand="BroncStudio"
                                price={product.price}
                                originalPrice={product.compare_at_price}
                                image={product.images?.[0] || product.image_url || '/images/placeholder.jpg'}
                                badge={product.stock_status === 'out_of_stock' ? 'Sold Out' : undefined}
                            />
                        )) : (
                            <div className="col-span-full text-center py-20 text-gray-400">
                                <LayoutGrid size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No products found for {node.data.name}.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
