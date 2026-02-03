'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '@/components/Product/ProductCard';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

interface TabbedProductShowcaseProps {
    categorySlug?: string;
}

export default function TabbedProductShowcase({ categorySlug = 'everyday-icons' }: TabbedProductShowcaseProps) {
    const [activeTab, setActiveTab] = useState('');
    const [tabs, setTabs] = useState<{ id: string; label: string; slug: string }[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [categoryNode, setCategoryNode] = useState<any>(null); // DB Data
    const supabase = createClient();

    // 1. Resolve Category & Tabs from DB
    useEffect(() => {
        const fetchCategoryData = async () => {
            // Check local taxonomy for legacy_slug to ensure we query DB with the right key
            // This allows us to strictly rename the frontend without migrating the DB immediately
            let targetSlug = categorySlug;

            // Try to find the node in local taxonomy to see if it has a legacy override
            // Iterate over values since we don't have the key directly here (unless categorySlug matches)
            // But usually categorySlug matches the key.
            const localNode = Object.values(require('@/data/categories').CATEGORY_TAXONOMY).find((c: any) => c.slug === categorySlug || c.legacy_slug === categorySlug) as any;

            if (localNode && localNode.legacy_slug) {
                // Only use legacy if we need to, but our DB seems to use the NEW slug 'clothing'.
                // Let's NOT override targetSlug unless we are sure.
                // Better strategy: Query for EITHER.
                // For now, let's comment out the force override or verify.
                // targetSlug = localNode.legacy_slug; 
            }

            // Fetch the main category (World/Level 1)
            const { data: catData, error } = await supabase
                .from('categories')
                .select('*, children:categories(*)') // Self-join for immediate children
                .eq('slug', targetSlug)
                .single();

            if (catData) {
                // If we found it via legacy slug, use the NEW name from local taxonomy if available
                // to effectively "rename" it in the UI even if DB receives old name
                if (localNode) {
                    setCategoryNode({ ...catData, name: localNode.name, description: localNode.description });

                    // USE LOCAL SUBCATEGORIES IF AVAILABLE (e.g. Men, Women, Kids)
                    if (localNode.subcategories && localNode.subcategories.length > 0) {
                        const newTabs = localNode.subcategories.map((sub: any) => ({
                            id: sub.id, // Virtual ID or whatever
                            label: sub.name,
                            slug: sub.slug
                        }));
                        setTabs(newTabs);
                        setActiveTab(newTabs[0].slug);
                        return; // Skip DB children fetch
                    }
                } else {
                    setCategoryNode(catData);
                }

                // Get subcategories (Tabs) from children (Fallback to DB)
                const { data: children } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('parent_id', catData.id)
                    .order('name');

                if (children && children.length > 0) {
                    const newTabs = children.map((sub: any) => ({
                        id: sub.id,
                        label: sub.name,
                        slug: sub.slug
                    }));
                    setTabs(newTabs);
                    setActiveTab(newTabs[0].slug);
                }
            }
        };

        fetchCategoryData();
    }, [categorySlug]);

    // 2. Fetch Products for Active Tab
    useEffect(() => {
        if (!activeTab) return;

        const fetchProducts = async () => {
            setLoading(true);

            // Determine if activeTab is a "Virtual" tab from local taxonomy
            // Re-resolve localNode to check
            const localNode = Object.values(require('@/data/categories').CATEGORY_TAXONOMY).find((c: any) => c.slug === categorySlug || c.legacy_slug === categorySlug) as any;
            const virtualSub = localNode?.subcategories?.find((s: any) => s.slug === activeTab);

            let targetIds: string[] = [];

            if (virtualSub && virtualSub.items) {
                // It is a virtual tab (e.g. "Men"). Use its 'items' to find real DB categories.
                const itemSlugs = virtualSub.items.map((i: any) => i.slug);

                // Fetch category IDs for these slugs
                const { data: childCats } = await supabase
                    .from('categories')
                    .select('id')
                    .in('slug', itemSlugs);

                if (childCats && childCats.length > 0) {
                    targetIds = childCats.map((c: any) => c.id);
                }
            } else {
                // Standard DB Logic (activeTab is a slug of a real category)
                // First, get the ID of the active tab category
                const { data: tabCat } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('slug', activeTab)
                    .single();

                if (tabCat) {
                    // Get IDs of its children
                    const { data: subChildren } = await supabase
                        .from('categories')
                        .select('id')
                        .eq('parent_id', tabCat.id);

                    targetIds = [tabCat.id, ...(subChildren?.map((c: any) => c.id) || [])];
                }
            }

            if (targetIds.length > 0) {
                const { data: prods } = await supabase
                    .from('products')
                    .select('*')
                    .in('category_id', targetIds)
                    .limit(8);

                if (prods) {
                    setProducts(prods.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        brand: 'BroncStudio',
                        price: p.price,
                        originalPrice: p.compare_at_price,
                        image: p.images?.[0] || p.image_url || '/images/placeholder.jpg',
                        secondaryImage: p.images?.[1],
                        badge: p.stock_status === 'out_of_stock' ? 'Sold Out' : undefined
                    })));
                } else {
                    setProducts([]);
                }
            } else {
                setProducts([]);
            }

            setLoading(false);
        };

        fetchProducts();
    }, [activeTab]);

    if (!categoryNode) return null; // Or skeleton

    return (
        <section className="py-16 md:py-24 bg-white dark:bg-black/5">
            <div className="container-premium max-w-[1400px] mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Category</span>
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-navy-900 dark:text-white mb-4">{categoryNode.name}</h2>
                    <p className="text-gray-500 text-lg">{categoryNode.description}</p>
                </div>

                {/* Tabs */}
                {tabs.length > 0 && (
                    <div className="flex justify-center mb-12">
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 border-b border-gray-100 dark:border-white/10 px-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.slug}
                                    onClick={() => setActiveTab(tab.slug)}
                                    className={`pb-4 text-base md:text-lg font-bold tracking-wide uppercase transition-all relative ${activeTab === tab.slug
                                        ? 'text-navy-900 dark:text-white'
                                        : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.slug && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-navy-900 dark:bg-white rounded-t-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <Loader2 className="animate-spin text-navy-900 mb-4" size={32} />
                            <p className="text-sm font-bold tracking-widest uppercase">Loading styles...</p>
                        </div>
                    ) : (
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8"
                            >
                                {products.length > 0 ? products.map((product) => (
                                    <div key={product.id}>
                                        <ProductCard {...product} />
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center text-gray-400">
                                        <p>No products found in this category.</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href={`/collections/${activeTab}`}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        View All {tabs.find(t => t.slug === activeTab)?.label}
                    </Link>
                </div>
            </div>
        </section>
    );
}
