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
import FilterSidebar from '@/components/Shop/FilterSidebar';
import FilterDrawer from '@/components/Shop/FilterDrawer';
import { Filter } from 'lucide-react';
import TabbedProductShowcase from '@/components/Home/TabbedProductShowcase';

// Strict Taxonomy Source
import { CATEGORY_TAXONOMY } from '@/data/categories';

export default function ShopPage() {
    const { formatPrice } = useUI();
    const params = useParams();
    const rawSlug = params?.slug;
    const slugArray = Array.isArray(rawSlug) ? rawSlug : rawSlug ? [rawSlug] : [];

    // Derived State from Local Taxonomy
    const [currentView, setCurrentView] = useState<{
        type: 'root' | 'category' | 'subcategory' | 'item' | '404';
        data: any;
        children: any[]; // The next level cards to show
        breadcrumbs: { label: string; href: string }[];
    } | null>(null);

    const [products, setProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Derived State for Client-Side Category Filtering (Subcategory View)
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // We need a map of Slug -> UUID for filtering.
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({}); // Slug -> UUID

    // Filter State
    const [isdrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        minPrice: 0,
        maxPrice: 10000,
        colors: [] as string[],
        sizes: [] as string[],
        brands: [] as string[]
    });

    const supabase = createClient();

    // Reset active category when view changes
    useEffect(() => {
        setActiveCategory('all');
    }, [currentView?.type, currentView?.data?.slug]);

    // 1. Resolve Taxonomy on Slug Change
    useEffect(() => {
        // Helper to traverse
        const resolve = () => {
            // A. Root (/shop)
            if (slugArray.length === 0) {
                return {
                    type: 'root' as const,
                    data: { name: 'Shop Worlds', description: 'Explore our curated collections.' },
                    children: Object.values(CATEGORY_TAXONOMY).map(c => ({
                        id: c.id,
                        name: c.name,
                        image: c.image, // Ensure image exists in taxonomy
                        slug: c.slug,
                        description: c.description
                    })),
                    breadcrumbs: []
                };
            }

            const [l1Slug, l2Slug, l3Slug] = slugArray;

            // B. Level 1 (e.g. kids-learning)
            const l1Node = Object.values(CATEGORY_TAXONOMY).find(c => c.slug === l1Slug);
            if (!l1Node) return { type: '404' as const, data: null, children: [], breadcrumbs: [] };

            if (slugArray.length === 1) {
                // Special Case: Pets (Flattened Item Toggle)
                if (l1Node.slug === 'pets') {
                    const flattenedItems = l1Node.subcategories?.flatMap((sc: any) =>
                        sc.items?.map((item: any) => ({
                            id: item.slug,
                            name: item.name,
                            slug: `${l1Slug}/${sc.slug}/${item.slug}`,
                            description: item.name // Simple desc
                        })) || []
                    ) || [];

                    return {
                        type: 'category' as const,
                        data: l1Node,
                        children: flattenedItems,
                        breadcrumbs: [{ label: l1Node.name, href: `/shop/${l1Node.slug}` }]
                    };
                }

                // Standard Category View
                return {
                    type: 'category' as const,
                    data: l1Node,
                    children: l1Node.subcategories?.map((sc: any) => ({
                        id: sc.id,
                        name: sc.name,
                        slug: `${l1Slug}/${sc.slug}`, // Construct nested href
                        description: sc.description || `Browse ${sc.name}`
                    })) || [],
                    breadcrumbs: [{ label: l1Node.name, href: `/shop/${l1Node.slug}` }]
                };
            }

            // C. Level 2 (e.g. kids-learning/books)
            const l2Node = l1Node.subcategories?.find((sc: any) => sc.slug === l2Slug);
            if (!l2Node) return { type: '404' as const, data: null, children: [], breadcrumbs: [] };

            if (slugArray.length === 2) {
                return {
                    type: 'subcategory' as const,
                    data: l2Node,
                    children: l2Node.items?.map((item: any) => ({
                        id: item.slug, // Use slug as ID for simple items
                        name: item.name,
                        slug: `${l1Slug}/${l2Slug}/${item.slug}`,
                        description: `See all` // Simple desc
                    })) || [],
                    breadcrumbs: [
                        { label: l1Node.name, href: `/shop/${l1Node.slug}` },
                        { label: l2Node.name, href: `/shop/${l1Node.slug}/${l2Node.slug}` }
                    ]
                };
            }

            // D. Level 3 (e.g. kids-learning/books/story-books) -> Leaf (Products)
            const l3Node = l2Node.items?.find((item: any) => item.slug === l3Slug);
            if (!l3Node) return { type: '404' as const, data: null, children: [], breadcrumbs: [] };

            return {
                type: 'item' as const,
                data: l3Node,
                children: [], // No deeper levels
                breadcrumbs: [
                    { label: l1Node.name, href: `/shop/${l1Node.slug}` },
                    { label: l2Node.name, href: `/shop/${l1Node.slug}/${l2Node.slug}` },
                    { label: l3Node.name, href: `/shop/${l1Node.slug}/${l2Node.slug}/${l3Node.slug}` }
                ]
            };
        };

        const result = resolve();
        setCurrentView(result);

    }, [params]); // Recalculate when URL matches

    // 2. Fetch Products if Leaf or Subcategory (Mixed View)
    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true);

            let targetSlugs: string[] = [];

            if (currentView?.type === 'item') {
                targetSlugs = [currentView.data.slug];
            } else if (currentView?.type === 'subcategory' || (currentView?.type === 'category' && currentView.data.slug === 'pets')) {
                // For Pets (and standard Subcategories), use children IDs as targets
                targetSlugs = currentView.children.map((c: any) => c.id);
            } else {
                setLoadingProducts(false);
                setProducts([]);
                return;
            }

            if (targetSlugs.length > 0) {
                // 1. Resolve Slugs to Category IDs AND Build Map
                const { data: categories, error: catError } = await supabase
                    .from('categories')
                    .select('id, slug')
                    .in('slug', targetSlugs);

                if (catError) {
                    console.error('Category Fetch Error:', catError);
                    setLoadingProducts(false);
                    return;
                }

                const newMap: Record<string, string> = {};
                const categoryIds: string[] = [];

                categories?.forEach((c: any) => {
                    newMap[c.slug] = c.id;
                    categoryIds.push(c.id);
                });
                setCategoryMap(newMap);

                if (categoryIds.length > 0) {
                    const { data, error } = await supabase
                        .from('products')
                        .select('id, name, price, compare_at_price, images, image_url, stock_status, brand, created_at, category_id')
                        .in('category_id', categoryIds);

                    if (error) console.error('Fetch Error:', error);
                    setProducts(data || []);
                } else {
                    setProducts([]);
                }
            } else {
                setProducts([]);
            }
            setLoadingProducts(false);
        };

        fetchProducts();
    }, [currentView]);

    // Enhanced Derived Filtered Products
    const filteredProducts = products.filter(product => {
        // 1. Active Category Filter
        if (activeCategory !== 'all') {
            // activeCategory is a slug (e.g. 'men-classic-crew')
            // product.category_id is UUID
            const targetId = categoryMap[activeCategory];
            if (!targetId || product.category_id !== targetId) return false;
        }

        // 2. Price
        if (product.price < activeFilters.minPrice || product.price > activeFilters.maxPrice) return false;

        // 3. Brand
        if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.brand)) return false;

        // 4. Color
        if (activeFilters.colors.length > 0) {
            const productColors = product.metadata?.colors || [];
            // Safety check for non-string
            if (Array.isArray(productColors)) {
                if (!activeFilters.colors.some(c => productColors.includes(c))) return false;
            }
        }

        // 5. Size
        if (activeFilters.sizes.length > 0) {
            const productSizes = product.metadata?.sizes || [];
            if (Array.isArray(productSizes)) {
                if (!activeFilters.sizes.some(s => productSizes.includes(s))) return false;
            }
        }
        return true;
    });

    if (currentView?.type === '404') {
        return (
            <div className="min-h-screen pt-[var(--header-height)] flex items-center justify-center bg-gray-50 dark:bg-navy-950">
                <div className="text-center">
                    <h2 className="text-3xl font-heading font-bold text-navy-900 dark:text-white mb-2">Page Not Found</h2>
                    <p className="text-gray-500 mb-6">The collection you are looking for doesn't exist.</p>
                    <Link href="/shop" className="px-6 py-3 bg-navy-900 text-white rounded-full font-bold hover:bg-coral-500 transition-all">
                        Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    if (!currentView) return <BrandLoader text="Curating Collection..." />;

    // ONLY Show "Cards" for Root. Subcategory (and Pets) now shows Products.
    const showChildren = currentView.type === 'root';
    const showProducts = currentView.type === 'item' || currentView.type === 'subcategory' || (currentView.type === 'category' && currentView.data.slug === 'pets');

    // Dynamic Gradient based on type
    const heroGradient = currentView.type === 'root'
        ? 'from-blue-500/10 via-purple-500/5 to-coral-500/10'
        : 'from-emerald-500/10 via-teal-500/5 to-blue-500/10';

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-navy-950 pt-[var(--header-height)] -mt-[var(--header-height)] pb-20 overflow-hidden">
            <AmbientBackground />





            {/* Background Blob */}
            <div className={`absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br ${heroGradient} blur-3xl opacity-40 pointer-events-none z-0`} />

            {/* Breadcrumbs */}
            <div className="relative z-40 px-6 py-4">
                <div className="max-w-fit mx-auto px-6 py-2 bg-white/50 dark:bg-navy-900/50 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/5 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-navy-700 dark:text-gray-300 shadow-sm">
                    <Link href="/" className="hover:text-coral-500 transition-colors">Home</Link>
                    <span className="opacity-40">/</span>
                    <Link href="/shop" className="hover:text-coral-500 transition-colors">Shop</Link>
                    {currentView.breadcrumbs.map((crumb, idx) => (
                        <React.Fragment key={idx}>
                            <span className="opacity-40">/</span>
                            <Link href={crumb.href} className={idx === currentView.breadcrumbs.length - 1 ? "text-coral-500" : "hover:text-coral-500 transition-colors"}>
                                {crumb.label}
                            </Link>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Conditional Layout: Tabbed for Category (Level 1) EXCEPT Pets, Standard for others */}
            {currentView.type === 'category' && currentView.data.slug !== 'pets' ? (
                <div className="-mt-12">
                    <TabbedProductShowcase categorySlug={currentView.data.slug} />
                </div>
            ) : (
                <>
                    {/* HERO TITLE REMOVED */}
                    <div className="relative z-30 max-w-[1400px] mx-auto px-6 pt-16 md:pt-24 pb-8 text-center">
                        <div className="mb-4"></div>
                    </div>

                    {/* CONTENT */}
                    <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">

                        {/* 1. Category/Subcategory Cards (Root Only) */}
                        {showChildren && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20"
                            >
                                {currentView.children.map((child: any, idx: number) => (
                                    <Link key={idx} href={`/shop/${child.slug}`} className="group relative">
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

                        {/* 2. Products (Item OR Subcategory) */}
                        {showProducts && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {loadingProducts ? (
                                    <div className="min-h-[40vh] flex items-center justify-center">
                                        <BrandLoader text="Fetching Items..." />
                                    </div>
                                ) : (
                                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                                        {/* Desktop Sidebar */}
                                        <div className="hidden lg:block w-[280px] flex-shrink-0 sticky top-32 space-y-8">

                                            {/* Subcategory Navigation Sidebar */}
                                            {(currentView.type === 'subcategory' || currentView.type === 'category') && (
                                                <div className="bg-white/40 dark:bg-navy-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-white/5">
                                                    <h3 className="text-sm font-bold uppercase tracking-wider text-navy-500 dark:text-gray-400 mb-4">Categories</h3>
                                                    <div className="flex flex-col space-y-2">
                                                        {/* All Products Option */}
                                                        <button
                                                            onClick={() => {
                                                                setActiveCategory('all');
                                                                // Shuffle products randomly
                                                                setProducts(prev => [...prev].sort(() => Math.random() - 0.5));
                                                            }}
                                                            className={`text-left text-lg font-heading font-bold transition-colors ${activeCategory === 'all'
                                                                ? 'text-coral-500'
                                                                : 'text-navy-900 dark:text-white hover:text-coral-500'
                                                                }`}
                                                        >
                                                            All Products
                                                        </button>

                                                        {currentView.children.map((child: any, idx: number) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => setActiveCategory(child.id)}
                                                                className={`text-left text-lg font-heading font-bold transition-colors ${activeCategory === child.id
                                                                    ? 'text-coral-500'
                                                                    : 'text-navy-900 dark:text-white hover:text-coral-500'
                                                                    }`}
                                                            >
                                                                {child.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Filters removed by request */}
                                        </div>

                                        {/* Product Grid */}
                                        <div className="flex-1 w-full">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                                                {filteredProducts.length > 0 ? filteredProducts.map((product, idx) => (
                                                    <motion.div
                                                        key={product.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.05 * idx }}
                                                    >
                                                        <ProductCard
                                                            id={product.id}
                                                            name={product.name}
                                                            brand={product.brand || "BroncStudio"}
                                                            price={product.price}
                                                            originalPrice={product.compare_at_price}
                                                            image={product.images?.[0] || '/images/placeholder.jpg'}
                                                            badge={product.stock_status === 'out_of_stock' ? 'Sold Out' : undefined}
                                                        />
                                                    </motion.div>
                                                )) : (
                                                    <div className="col-span-full py-32 text-center text-gray-400">
                                                        <div className="w-20 h-20 bg-gray-100 dark:bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                                            <Filter size={32} className="opacity-50" />
                                                        </div>
                                                        <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">No Matches Found</h3>
                                                        <p>Try adjusting your filters or category.</p>
                                                        <button
                                                            onClick={() => {
                                                                setActiveFilters({ minPrice: 0, maxPrice: 10000, colors: [], sizes: [], brands: [] });
                                                                setActiveCategory('all');
                                                            }}
                                                            className="mt-4 text-coral-500 font-bold hover:underline"
                                                        >
                                                            Clear All Filters
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
