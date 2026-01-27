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

    const supabase = createClient();

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

    // 2. Fetch Products if Leaf
    useEffect(() => {
        const fetchProducts = async () => {
            if (currentView?.type === 'item') {
                setLoadingProducts(true);
                // Use the Leaf Slug (e.g. 'story-books') to match DB 'subcategory_slug' or similar
                // Assuming DB has updated matching slugs. If not, this might be empty.
                // Using 'ilike' for partial match or exact match on tags if schema is different.

                const target = currentView.data.slug; // e.g. 'story-books'

                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .or(`tags.cs.{${target}}, category_slug.eq.${target}, subcategory_slug.eq.${target}`);

                if (error) console.error(error);
                setProducts(data || []);
                setLoadingProducts(false);
            } else {
                setProducts([]);
            }
        };

        fetchProducts();
    }, [currentView]);


    if (currentView?.type === '404') {
        return (
            <div className="min-h-screen pt-[var(--header-height)] flex items-center justify-center bg-background">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-navy-900 mb-2">Page Not Found</h2>
                    <Link href="/shop" className="text-coral-500 hover:underline">Return to Shop</Link>
                </div>
            </div>
        );
    }

    if (!currentView) return <BrandLoader text="Loading..." />;

    const showChildren = currentView.children.length > 0;
    const showProducts = currentView.type === 'item';

    return (
        <div className="relative min-h-screen pt-[var(--header-height)] pb-20 bg-background">
            <AmbientBackground />

            {/* Breadcrumbs */}
            <div className="sticky top-[72px] z-40 px-6 py-4 pointer-events-none">
                <div className="max-w-fit mx-auto px-6 py-2 bg-white/70 dark:bg-navy-900/70 backdrop-blur-[18px] rounded-full shadow-sm border border-white/50 dark:border-white/10 pointer-events-auto flex items-center space-x-2 text-sm text-navy-700 dark:text-gray-300 font-medium overflow-x-auto">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <Link href="/shop">Shop</Link>
                    {currentView.breadcrumbs.map((crumb, idx) => (
                        <React.Fragment key={idx}>
                            <span>/</span>
                            <Link href={crumb.href} className={idx === currentView.breadcrumbs.length - 1 ? "text-coral-500" : ""}>
                                {crumb.label}
                            </Link>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* HERO */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-12 flex flex-col justify-center text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-sm font-bold tracking-widest uppercase mb-4 text-coral-500">
                        {currentView.type === 'root' ? 'Collection' : currentView.type}
                    </div>
                    <h1 className="text-4xl md:text-[42px] font-heading font-bold text-navy-900 dark:text-white mb-4 leading-tight">
                        {currentView.data?.name}
                    </h1>
                    {currentView.data?.description && (
                        <p className="text-[16px] text-gray-600 dark:text-gray-400 max-w-[520px] mx-auto leading-relaxed">
                            {currentView.data.description}
                        </p>
                    )}
                </motion.div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6">

                {/* 1. Category/Subcategory Cards */}
                {showChildren && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-12">
                        {currentView.children.map((child: any, idx: number) => (
                            <Link key={idx} href={`/shop/${child.slug}`} className="block group">
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
                    <>
                        {loadingProducts ? (
                            <BrandLoader text="Fetching Items..." />
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px]">
                                {products.length > 0 ? products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        brand="BroncStudio"
                                        price={product.price}
                                        originalPrice={product.compare_at_price}
                                        image={product.images?.[0] || '/images/placeholder.jpg'}
                                        badge={product.stock_status === 'out_of_stock' ? 'Sold Out' : undefined}
                                    />
                                )) : (
                                    <div className="col-span-full text-center py-20 text-gray-400">
                                        <LayoutGrid size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>No products found for {currentView.data?.name}.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
