'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import GlassCard from '@/components/UI/GlassCard';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '@/context/UIContext';
import ProductCard from '@/components/Product/ProductCard';
import { createClient } from '@/utils/supabase/client';
import { LayoutGrid, SlidersHorizontal, X } from 'lucide-react';
import BrandLoader from '@/components/UI/BrandLoader';
import { FLAT_TAXONOMY, FlatNode } from '@/data/flatTaxonomy';
import FilterSidebar from '@/components/Collection/FilterSidebar';
import SortBar, { SortOption } from '@/components/Collection/SortBar';
import ActiveFilters from '@/components/Collection/ActiveFilters';
import TabbedProductShowcase from '@/components/Home/TabbedProductShowcase';

// This page handles ALL levels: World, Category, and Leaf Item
export default function CollectionPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [node, setNode] = useState<FlatNode | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter & Sort State
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [sortOption, setSortOption] = useState<SortOption>('featured');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const supabase = createClient();

    // 1. Resolve Node from Flat Taxonomy OR Curated DB
    useEffect(() => {
        if (!slug) return;

        const resolveData = async () => {
            // A. Check Flat Taxonomy (Static)
            const foundNode = FLAT_TAXONOMY[slug];
            if (foundNode) {
                setNode(foundNode);
                setLoading(false);
                return;
            }

            // B. Check Curated Collections (Dynamic DB)
            // GUID Regex or just try fetching
            if (slug.length > 20) { // Simple heuristic for UUID-like length
                const { data: section } = await supabase
                    .from('curated_sections')
                    .select('*')
                    .eq('id', slug)
                    .single();

                if (section) {
                    setNode({
                        type: 'curated',
                        data: {
                            name: section.title,
                            slug: section.id, // Use ID as slug for internal logic
                            description: section.description,
                            image: section.image_url,
                            items: []
                        },
                        parent: { name: 'Collections', slug: '' }
                    });
                    setLoading(false);
                    return;
                }
            }

            setNode(null);
            setLoading(false);
        };

        resolveData();
    }, [slug]);

    // 2. Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            if (!node) return;

            setLoading(true);

            // Case A: Curated Collection
            if (node.type === 'curated') {
                // Fetch ALL products (optimized select) then filter in memory/JS for reliability with JSON arrays
                const { data, error } = await supabase
                    .from('products')
                    .select('id, name, price, compare_at_price, images, stock_status, created_at, category_id, metadata');

                if (error) {
                    console.error("Error fetching products:", error);
                } else if (data) {
                    // Filter where curated_section_ids includes our slug
                    const filtered = data.filter((p: any) =>
                        p.metadata?.curated_section_ids?.includes(node.data.slug)
                    );
                    setProducts(filtered);
                }
                setLoading(false);
                return;
            }

            // Case B: Standard Category/Item
            if (node.type === 'item' || node.type === 'category') {
                const targetSlug = node.data.slug;

                // 1. Get Category ID
                const { data: catData, error: catError } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('slug', targetSlug)
                    .single();

                if (catError || !catData) {
                    setLoading(false);
                    return;
                }

                let productQuery = supabase.from('products').select('id, name, price, compare_at_price, images, stock_status, created_at, category_id');

                if (node.type === 'item') {
                    // Leaf: Direct match
                    productQuery = productQuery.eq('category_id', catData.id);
                } else {
                    // Category: Match children items
                    const childSlugs = node.data.items?.map((i: any) => i.slug) || [];
                    if (childSlugs.length > 0) {
                        const { data: childrenCats } = await supabase
                            .from('categories')
                            .select('id')
                            .in('slug', childSlugs);

                        if (childrenCats && childrenCats.length > 0) {
                            const ids = childrenCats.map((c: { id: string }) => c.id);
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
                if (error) console.error("Error fetching products:", error);

                setProducts(data || []);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [node]);

    // 3. Client-Side Filtering & Sorting
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filter: Price (Mock Logic - actual would parse "$50 - $100")
        if (filters.price?.length) {
            // Very basic implementation for demo
        }

        // Filter: Color
        if (filters.color?.length) {
            result = result.filter(p => {
                const pColor = p.metadata?.color || p.metadata?.colors?.[0]?.name;
                return filters.color.includes(pColor);
            });
        }

        // Filter: Size
        if (filters.size?.length) {
            result = result.filter(p => {
                const pSizes = p.metadata?.sizes || [];
                return filters.size.some(s => pSizes.includes(s));
            });
        }

        // Sort
        switch (sortOption) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'alpha-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'alpha-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            default: // featured
                break;
        }

        return result;
    }, [products, filters, sortOption]);


    // Handlers
    const handleFilterChange = (type: string, value: string) => {
        setFilters(prev => {
            const current = prev[type] || [];
            if (current.includes(value)) {
                const updated = current.filter(v => v !== value);
                if (updated.length === 0) {
                    const { [type]: _, ...rest } = prev;
                    return rest;
                }
                return { ...prev, [type]: updated };
            } else {
                return { ...prev, [type]: [...current, value] };
            }
        });
    };

    const removeFilter = (key: string, value: string) => {
        setFilters(prev => {
            const current = prev[key] || [];
            const updated = current.filter(v => v !== value);
            if (updated.length === 0) {
                const { [key]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [key]: updated };
        });
    };

    const clearAllFilters = () => setFilters({});


    if (loading) return <BrandLoader text="Loading Collection..." />;

    if (!node) {
        return (
            <div className="min-h-screen pt-[var(--header-height)] flex items-center justify-center bg-gray-50 dark:bg-navy-950">
                <div className="text-center">
                    <h2 className="text-3xl font-heading font-bold text-navy-900 dark:text-white mb-2">Collection Not Found</h2>
                    <Link href="/" className="px-6 py-3 bg-navy-900 text-white rounded-full font-bold hover:bg-coral-500 transition-all inline-block mt-4">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    // Determine content type
    let children: any[] = [];
    if (node.type === 'world') {
        children = node.data.subcategories || [];
    } else if (node.type === 'category') {
        children = node.data.items || [];
    }

    const showCards = children.length > 0;
    const showProducts = node.type === 'item' || node.type === 'category'; // 'category' can show both subs and products ideally, but sticking to logic

    // Dynamic Gradient
    const heroGradient = node.type === 'world'
        ? 'from-blue-500/10 via-purple-500/5 to-coral-500/10'
        : 'from-emerald-500/10 via-teal-500/5 to-blue-500/10';

    return (
        <div className="relative min-h-screen bg-white dark:bg-navy-950 pt-[var(--header-height)] pb-20 overflow-hidden">
            <AmbientBackground />

            {/* Background Blob */}
            <div className={`absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br ${heroGradient} blur-3xl opacity-50 pointer-events-none`} />

            {/* Breadcrumbs */}
            <div className="relative z-40 px-6 py-4 container-premium mx-auto">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <Link href="/" className="hover:text-coral-500 transition-colors">Home</Link>
                    <span>/</span>
                    {node.parent && (
                        <>
                            <Link href={`/collections/${node.parent.slug}`} className="hover:text-coral-500 transition-colors">{node.parent.name}</Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-navy-900 dark:text-white">{node.data.name}</span>
                </div>
            </div>

            {/* Special Layout for World Categories (Everyday Icons, Little Legends, etc.) */}
            {node.type === 'world' ? (
                <div className="-mt-12">
                    <TabbedProductShowcase categorySlug={slug} />
                </div>
            ) : (
                <>
                    {/* STANDARD HERO TITLE */}
                    <div className="relative z-10 container-premium mx-auto px-6 py-8 md:py-12 text-center border-b border-gray-100 dark:border-white/5 mb-8">
                        <h1 className="text-4xl md:text-5xl font-heading font-black text-navy-900 dark:text-white mb-4">
                            {node.data.name}
                        </h1>
                        {node.data.description && (
                            <p className="text-gray-500 max-w-2xl mx-auto">{node.data.description}</p>
                        )}
                    </div>

                    {/* STANDARD CONTENT AREA */}
                    <div className="container-premium mx-auto px-4 md:px-6">

                        {/* 1. Sub-Collection Cards (Worlds/Higher Categories) */}
                        {showCards && !showProducts && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {children.map((child: any, idx: number) => (
                                    <Link key={idx} href={`/collections/${child.slug}`}>
                                        <GlassCard className="p-8 h-full flex flex-col items-center justify-center text-center hover:border-coral-500/30 transition-colors">
                                            <LayoutGrid size={32} className="text-coral-500 mb-4" />
                                            <h3 className="text-xl font-bold text-navy-900 dark:text-white">{child.name}</h3>
                                            <p className="text-sm text-gray-500 mt-2">{child.description}</p>
                                        </GlassCard>
                                    </Link>
                                ))}
                            </motion.div>
                        )}

                        {/* 2. Products with Sidebar */}
                        {showProducts && (
                            <div className="flex gap-8 lg:gap-12 relative items-start">
                                {/* Category Sidebar (Restored) */}
                                <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
                                    <div className="border-r border-gray-100 dark:border-white/5 pr-6 min-h-[50vh]">
                                        <h3 className="font-bold mb-6 uppercase text-xs tracking-wider text-gray-400">
                                            {node.type === 'item' ? node.parent?.name || 'More in this collection' : 'Categories'}
                                        </h3>
                                        <div className="space-y-1">
                                            {(() => {
                                                // Determine Sidebar Items
                                                let sidebarItems: any[] = [];
                                                let parentSlug = slug;

                                                if (node.type === 'category') {
                                                    sidebarItems = node.data.items || [];
                                                    parentSlug = slug;
                                                } else if (node.type === 'item' && node.parent?.slug) {
                                                    const parentNode = FLAT_TAXONOMY[node.parent.slug];
                                                    sidebarItems = parentNode?.data?.items || [];
                                                    parentSlug = node.parent.slug;
                                                }

                                                return (
                                                    <>
                                                        <Link
                                                            href={`/collections/${parentSlug}`}
                                                            className={`block py-2 text-sm font-medium transition-colors ${slug === parentSlug
                                                                ? 'text-coral-500 translate-x-1 font-bold'
                                                                : 'text-navy-900 dark:text-gray-300 hover:text-coral-500 hover:translate-x-1'
                                                                }`}
                                                        >
                                                            All Products
                                                        </Link>

                                                        {sidebarItems.map((item) => {
                                                            const isActive = slug === item.slug;
                                                            return (
                                                                <Link
                                                                    key={item.slug}
                                                                    href={`/collections/${item.slug}`}
                                                                    className={`block py-2 text-sm font-medium transition-colors ${isActive
                                                                        ? 'text-coral-500 translate-x-1'
                                                                        : 'text-navy-900 dark:text-gray-300 hover:text-coral-500 hover:translate-x-1'
                                                                        }`}
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            );
                                                        })}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </aside>

                                {/* Sort Bar & Grid Only (Filters Removed) */}
                                <div className="flex-1 w-full">
                                    <SortBar
                                        totalProducts={filteredProducts.length}
                                        sortOption={sortOption}
                                        onSortChange={setSortOption}
                                    />
                                    {/* ActiveFilters removed as there are no filters */}

                                    {filteredProducts.length > 0 ? (
                                        <motion.div
                                            layout
                                            className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 lg:gap-x-8"
                                        >
                                            {filteredProducts.map((product) => (
                                                <motion.div layout key={product.id}>
                                                    <ProductCard
                                                        id={product.id}
                                                        name={product.name}
                                                        price={product.price}
                                                        originalPrice={product.compare_at_price}
                                                        image={product.images?.[0] || product.image_url || '/images/placeholder.jpg'}
                                                        secondaryImage={product.images?.[1]}
                                                        badge={product.stock_status === 'out_of_stock' ? 'Sold Out' : undefined}
                                                    />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <div className="py-20 text-center text-gray-400">
                                            <h3 className="text-xl font-bold">No products found</h3>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
