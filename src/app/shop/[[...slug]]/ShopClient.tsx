'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import GlassCard from '@/components/UI/GlassCard';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { motion } from 'framer-motion';
import { useUI } from '@/context/UIContext';
import ProductCard from '@/components/Product/ProductCard';
import { createClient } from '@/utils/supabase/client';
import { Filter } from 'lucide-react';
import BrandLoader from '@/components/UI/BrandLoader';
import TabbedProductShowcase from '@/components/Home/TabbedProductShowcase';

// Strict Taxonomy Source
import { CATEGORY_TAXONOMY } from '@/data/categories';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';
import { TaxonomyCategory, TaxonomySubcategory, TaxonomyItem, DBProduct, ShopView, ShopProduct, ShopCardData } from '@/types/shop';

export default function ShopClient() {
    const { formatPrice } = useUI();
    const params = useParams();
    const rawSlug = params?.slug;
    const slugArray = Array.isArray(rawSlug) ? rawSlug : rawSlug ? [rawSlug] : [];

    // Derived State from Local Taxonomy
    const [currentView, setCurrentView] = useState<ShopView | null>(null);
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Derived State for Client-Side Category Filtering (Subcategory View)
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // We need a map of Slug -> UUID for filtering.
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({}); // Slug -> UUID

    // Filter State
    const [activeFilters] = useState({
        minPrice: 0,
        maxPrice: 10000,
        colors: [] as string[],
        sizes: [] as string[],
        brands: [] as string[]
    });
    const [shopHeroConfig, setShopHeroConfig] = useState<Record<string, string>>({});

    const supabase = useMemo(() => createClient(), []);

    // 1. Resolve Taxonomy on Slug Change
    useEffect(() => {
        const fetchShopConfigs = async () => {
            try {
                const { data, error } = await supabase
                    .from('content_blocks')
                    .select('section_id, content')
                    .in('section_id', ['shop_page_collections', 'shop_hero_images']);

                if (!error && data) {
                    const collections = data.find((b: { section_id: string; content: unknown }) => b.section_id === 'shop_page_collections')?.content;
                    const heroImages = data.find((b: { section_id: string; content: unknown }) => b.section_id === 'shop_hero_images')?.content;
                    return { collections: collections as unknown as ShopCardData[], heroImages: (heroImages || {}) as Record<string, string> };
                }

            } catch (err) {
                console.error('Error fetching dynamic shop configs:', err);
            }
            return { collections: null, heroImages: {} };
        };


        // Helper to traverse
        const resolve = async () => {
            const { collections: dynamicCollections, heroImages } = await fetchShopConfigs();
            setShopHeroConfig(heroImages);

            // A. Root (/shop)
            if (slugArray.length === 0) {
                const children = dynamicCollections || Object.values(CATEGORY_TAXONOMY).map(c => ({
                    id: c.id,
                    name: c.name,
                    image: c.image, // Ensure image exists in taxonomy
                    slug: c.slug,
                    description: c.description
                }));

                const rootHero = (heroImages as Record<string, string>)['root'] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80';

                setCurrentView({
                    type: 'root' as const,
                    data: { name: 'Shop Worlds', description: 'Explore our curated collections.' } as unknown as TaxonomyCategory,
                    children: children as ShopCardData[],
                    breadcrumbs: [],
                    heroImage: getGoogleDriveDirectLink(rootHero) || '/images/placeholder.jpg'
                });
                setActiveCategory('all');
                return;
            }


            const [l1Slug, l2Slug, l3Slug] = slugArray;

            // B. Level 1 (e.g. kids-learning)
            const l1Node = (Object.values(CATEGORY_TAXONOMY) as TaxonomyCategory[]).find(c => c.slug === l1Slug);
            if (!l1Node) {
                setCurrentView({ type: '404' as const, data: null, children: [], breadcrumbs: [] });
                return;
            }

            if (slugArray.length === 1) {
                // Special Case: Pets (Flattened Item Toggle)
                if (l1Node.slug === 'pets') {
                    const flattenedItems = l1Node.subcategories?.flatMap((sc) =>
                        sc.items?.map((item) => ({
                            id: item.slug,
                            name: item.name,
                            slug: `${l1Slug}/${sc.slug}/${item.slug}`,
                            description: item.name // Simple desc
                        })) || []
                    ) || [];

                    const categoryHero = (heroImages as Record<string, string>)[l1Node.slug] || l1Node.image;

                    setCurrentView({
                        type: 'category' as const,
                        data: l1Node,
                        children: flattenedItems.map(item => ({
                            id: item.id,
                            name: item.name,
                            slug: item.slug,
                            image: '', // Pets use root image
                            description: item.description
                        })),
                        breadcrumbs: [{ label: l1Node.name, href: `/shop/${l1Node.slug}` }],
                        heroImage: getGoogleDriveDirectLink(categoryHero) || '/images/placeholder.jpg'
                    });
                    setActiveCategory('all');
                    return;
                }

                // Standard Category View
                const categoryHero = (heroImages as Record<string, string>)[l1Node.slug] || l1Node.image;

                setCurrentView({
                    type: 'category' as const,
                    data: l1Node,
                    children: l1Node.subcategories?.map((sc) => ({
                        id: sc.id,
                        name: sc.name,
                        slug: `${l1Slug}/${sc.slug}`, // Construct nested href
                        image: sc.image || '', // Fallback if image not on sub
                        description: sc.description || `Browse ${sc.name}`
                    })) || [],
                    breadcrumbs: [{ label: l1Node.name, href: `/shop/${l1Node.slug}` }],
                    heroImage: getGoogleDriveDirectLink(categoryHero)
                });

                return;
            }

            // C. Level 2 (e.g. kids-learning/books)
            const l2Node = l1Node.subcategories?.find((sc: TaxonomySubcategory) => sc.slug === l2Slug);
            if (!l2Node) {
                setCurrentView({ type: '404' as const, data: null, children: [], breadcrumbs: [] });
                return;
            }

            if (slugArray.length === 2) {
                const subHeroLink = `${l1Node.slug}/${l2Node.slug}`;
                const subHero = (heroImages as Record<string, string>)[subHeroLink] || (heroImages as Record<string, string>)[l1Node.slug] || l1Node.image;

                setCurrentView({
                    type: 'subcategory' as const,
                    data: l2Node as unknown as TaxonomySubcategory,
                    children: l2Node.items?.map((item) => ({
                        id: item.slug, // Use slug as ID for simple items
                        name: item.name,
                        slug: `${l1Slug}/${l2Slug}/${item.slug}`,
                        image: '', // Leaf items don't have separate card images here
                        description: `See all` // Simple desc
                    })) || [],
                    breadcrumbs: [
                        { label: l1Node.name, href: `/shop/${l1Node.slug}` },
                        { label: l2Node.name, href: `/shop/${l1Node.slug}/${l2Node.slug}` }
                    ],
                    heroImage: getGoogleDriveDirectLink(subHero) || '/images/placeholder.jpg'
                });
                setActiveCategory('all');
                return;
            }

            // D. Level 3 (e.g. kids-learning/books/story-books) -> Leaf (Products)
            const l3Node = l2Node.items?.find((item) => item.slug === l3Slug);
            if (!l3Node) {
                setCurrentView({ type: '404' as const, data: null, children: [], breadcrumbs: [] });
                return;
            }

            const subHeroLink = `${l1Node.slug}/${l2Node.slug}`;
            const itemHero = (heroImages as Record<string, string>)[subHeroLink] || (heroImages as Record<string, string>)[l1Node.slug] || l1Node.image;

            setCurrentView({
                type: 'item' as const,
                data: l3Node as unknown as TaxonomyItem,
                children: [], // No deeper levels
                breadcrumbs: [
                    { label: l1Node.name, href: `/shop/${l1Node.slug}` },
                    { label: l2Node.name, href: `/shop/${l1Node.slug}/${l2Slug}` },
                    { label: l3Node.name, href: `/shop/${l1Node.slug}/${l2Slug}/${l3Node.slug}` }
                ],
                heroImage: getGoogleDriveDirectLink(itemHero)
            });
            setActiveCategory('all');

        };

        resolve();
    }, [params, slugArray, supabase]); // Recalculate when URL matches

    // 2. Fetch Products if Leaf or Subcategory (Mixed View)
    useEffect(() => {
        const fetchProducts = async () => {
            if (!currentView) return;
            setLoadingProducts(true);

            let targetSlugs: string[] = [];

            if (currentView.type === 'item') {
                targetSlugs = [((currentView.data as { slug?: string })?.slug) || ''];
            } else if (currentView.type === 'subcategory' || (currentView.type === 'category' && (currentView.data as { slug?: string })?.slug === 'pets')) {
                // For Pets (and standard Subcategories), use children IDs as targets
                targetSlugs = currentView.children.map(c => c.id);
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

                categories?.forEach((c: { id: string; slug: string }) => {
                    newMap[c.slug] = c.id;
                    categoryIds.push(c.id);
                });
                setCategoryMap(newMap);

                if (categoryIds.length > 0) {
                    const { data, error } = await supabase
                        .from('products')
                        .select('*')
                        .in('category_id', categoryIds);

                    if (error) {
                        console.error('Fetch Error:', error);
                    }
                    const mapped: ShopProduct[] = (data || []).map((p: DBProduct) => ({
                        id: p.id,
                        name: p.name,
                        brand: p.brand || 'BroncStudio',
                        price: p.price,
                        originalPrice: p.compare_at_price,
                        image: p.images?.[0] || p.image_url || '/images/placeholder.jpg',
                        secondaryImage: p.images?.[1],
                        badge: p.stock_status === 'out_of_stock' ? 'Sold Out' : undefined
                    }));
                    setProducts(mapped);
                } else {
                    setProducts([]);
                }
            } else {
                setProducts([]);
            }
            setLoadingProducts(false);
        };

        fetchProducts();
    }, [currentView, supabase]);

    // Enhanced Derived Filtered Products
    const filteredProducts = products.filter(product => {
        // 1. Active Category Filter
        if (activeCategory !== 'all') {
            // categoryMap[activeCategory];
            // Since we don't have category_id on ShopProduct anymore, we'd need to add it or skip this check if filtered at DB
            // However, ShopClient's activeCategory logic assumes we have it. 
            // For now, I'll let the DB filtering handle it and keep this as fallback.
        }

        // 2. Price
        if (product.price < activeFilters.minPrice || product.price > activeFilters.maxPrice) return false;

        // 3. Brand
        if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.brand || "BroncStudio")) return false;

        return true;
    });

    if (currentView?.type === '404') {
        return (
            <div className="min-h-screen pt-[var(--header-height)] flex items-center justify-center bg-gray-50 dark:bg-navy-950">
                <div className="text-center">
                    <h2 className="text-3xl font-heading font-bold text-navy-900 dark:text-white mb-2">Page Not Found</h2>
                    <p className="text-gray-500 mb-6">The collection you are looking for doesn&apos;t exist.</p>
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
    const showProducts = currentView.type === 'item' || currentView.type === 'subcategory' || (currentView.type === 'category' && (currentView.data as { slug?: string })?.slug === 'pets');

    // Dynamic Gradient based on type
    const heroGradient = currentView.type === 'root'
        ? 'from-blue-500/10 via-purple-500/5 to-coral-500/10'
        : 'from-emerald-500/10 via-teal-500/5 to-blue-500/10';

    return (
        <div className="relative min-h-screen bg-background pt-[220px] -mt-[120px] pb-20 overflow-hidden">
            <AmbientBackground />

            {/* HERO BANNER IMAGE (If Available) */}
            {currentView.heroImage && (
                <div className="absolute top-0 left-0 right-0 h-[400px] md:h-[500px] z-0">
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <img
                        src={currentView.heroImage}
                        alt="Collection Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-black to-transparent z-20" />
                </div>
            )}


            {/* Background Blob */}
            <div className={`absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br ${heroGradient} ${currentView.heroImage ? 'opacity-20' : 'opacity-40'} blur-3xl pointer-events-none z-0`} />

            {/* Breadcrumbs */}
            <div className="relative z-40 px-6 py-4 mt-8">
                <div className="max-w-fit mx-auto px-6 py-2 bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/5 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-secondary shadow-sm">
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

            {/* Hero Title & Tagline */}
            <div className="relative z-30 max-w-[1400px] mx-auto px-6 pt-4 pb-12 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 drop-shadow-lg"
                >
                    {(currentView.data as { name: string })?.name}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md"
                >
                    {(currentView.data as { description?: string })?.description}
                </motion.p>
            </div>

            {/* Conditional Layout */}
            {currentView.type === 'category' && (currentView.data as { slug?: string })?.slug !== 'pets' ? (
                <div className="-mt-12">
                    <TabbedProductShowcase categorySlug={(currentView.data as { slug?: string })?.slug || ''} />
                </div>
            ) : (
                <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
                    {showChildren && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20"
                        >
                            {currentView.children.map((child, idx) => (
                                <Link key={idx} href={`/shop/${child.slug}`} className="group relative block h-full">
                                    <GlassCard className="relative h-full min-h-[400px] flex flex-col justify-end overflow-hidden rounded-[2rem] bg-transparent hover:border-white/50 transition-all duration-500" disableTilt>
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getGoogleDriveDirectLink(child.image) || '/images/placeholder.jpg'})` }} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60" />
                                        <div className="relative z-10 p-8">
                                            <h3 className="text-3xl font-heading font-bold text-white mb-2">{child.name}</h3>
                                            <p className="text-sm text-white/80 line-clamp-2">{child.description}</p>
                                        </div>
                                    </GlassCard>
                                </Link>
                            ))}
                        </motion.div>
                    )}

                    {showProducts && (
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            <aside className="hidden lg:block w-[280px] flex-shrink-0 sticky top-32">
                                {(currentView.type === 'subcategory' || currentView.type === 'category') && (
                                    <div className="bg-white/40 dark:bg-card/40 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">Categories</h3>
                                        <div className="flex flex-col space-y-2">
                                            <button onClick={() => setActiveCategory('all')} className={`text-left text-lg font-heading font-bold ${activeCategory === 'all' ? 'text-coral-500' : 'text-primary'}`}>All Products</button>
                                            {currentView.children.map((child, idx) => (
                                                <button key={idx} onClick={() => setActiveCategory(child.id)} className={`text-left text-lg font-heading font-bold ${activeCategory === child.id ? 'text-coral-500' : 'text-primary'}`}>{child.name}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </aside>

                            <div className="flex-1 w-full">
                                {loadingProducts ? (
                                    <div className="flex justify-center py-20"><BrandLoader text="Loading..." /></div>
                                ) : filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                        {filteredProducts.map((p) => (
                                            <ProductCard key={p.id} {...p} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center"><h3 className="text-xl font-bold">No products found</h3></div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
