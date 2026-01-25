'use client';

import React from 'react';
import { CATEGORY_TAXONOMY } from '@/data/categories';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import GlassCard from '@/components/UI/GlassCard';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { motion } from 'framer-motion';
import { Home, ArrowRight } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import ProductCard from '@/components/Product/ProductCard';
import { getProductImage } from '@/utils/sampleImages';

// Define Virtual Collections for "Quick Shop"
const SPECIAL_COLLECTIONS: Record<string, { name: string; description: string }> = {
    'new-arrivals': { name: 'New Arrivals', description: 'Fresh drops and latest styles for your little ones.' },
    'bestsellers': { name: 'Bestsellers', description: 'Most loved favorites chosen by parents like you.' },
    'sale': { name: 'Under ₹299', description: 'Pocket-friendly picks without compromising on style.' },
    'gifts': { name: 'Gifts Under ₹499', description: 'Perfect little presents for every occasion.' },
    'limited': { name: 'Limited Editions', description: 'Exclusive pieces found nowhere else. Gone in a flash.' }
};

const findCategoryData = (slugs: string[] = []) => {
    if (slugs.length === 0) return { type: 'root', data: null };
    const [worldSlug, intentSlug] = slugs;

    // Check for Special Collections (Quick Shop)
    if (slugs.length === 1 && SPECIAL_COLLECTIONS[worldSlug]) {
        return {
            type: 'intent', // Treat as an intent to show product grid
            data: { ...SPECIAL_COLLECTIONS[worldSlug], slug: worldSlug },
            parent: { name: 'Shop', slug: 'shop' },
            crumbs: [{ name: 'Shop', slug: 'shop' }, { ...SPECIAL_COLLECTIONS[worldSlug], slug: worldSlug }]
        };
    }

    const world = Object.values(CATEGORY_TAXONOMY).find(c => c.slug === worldSlug);
    if (!world) return null;
    if (!intentSlug) return { type: 'world', data: world, crumbs: [world] };
    let intentData = null;
    if ('intents' in world && Array.isArray(world.intents)) {
        intentData = world.intents.find(i => i.slug === intentSlug);
    }
    if (!intentData) {
        if ('subcategories' in world) intentData = world.subcategories.find(s => s.slug === intentSlug);
    }
    if (intentData) return { type: 'intent', data: intentData, parent: world, crumbs: [world, intentData] };
    return { type: 'unknown', data: null };
};

export default function ShopPage() {
    const { formatPrice } = useUI();
    const params = useParams();
    const rawSlug = params?.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug : rawSlug ? [rawSlug] : [];

    // Improved Category Resolution Logic
    const findDeepCategoryData = (slugs: string[] = []) => {
        if (slugs.length === 0) return { type: 'root', data: null };
        const [rootSlug, ...restSlugs] = slugs;
        const targetSlug = slugs[slugs.length - 1]; // The actual item we are looking for

        // 1. Check for SPECIAL_COLLECTIONS (Quick Shop)
        if (slugs.length === 1 && SPECIAL_COLLECTIONS[rootSlug]) {
            return {
                type: 'intent',
                data: { ...SPECIAL_COLLECTIONS[rootSlug], slug: rootSlug },
                parent: { name: 'Shop', slug: 'shop' },
                crumbs: [{ name: 'Shop', slug: 'shop' }, { ...SPECIAL_COLLECTIONS[rootSlug], slug: rootSlug }]
            };
        }

        // 2. Deep Search in Taxonomy
        // First, check if it matches a top-level World
        const world = Object.values(CATEGORY_TAXONOMY).find(c => c.slug === rootSlug);
        if (world && slugs.length === 1) {
            return { type: 'world', data: world, crumbs: [world] };
        }

        // Deep Search Helper
        const searchCategory = (categories: any[], parentArgs: any[]): any => {
            for (const category of categories) {
                if (category.slug === targetSlug) {
                    return { type: 'intent', data: category, parent: parentArgs[parentArgs.length - 1], crumbs: [...parentArgs, category] };
                }
                // Search in subcategories
                if (category.subcategories) {
                    const found = searchCategory(category.subcategories, [...parentArgs, category]);
                    if (found) return found;
                }
                // Search in intents
                if (category.intents) {
                    const found = searchCategory(category.intents, [...parentArgs, category]);
                    if (found) return found;
                }
                // Search in groups (e.g., Men, Women)
                if (category.groups) {
                    const found = searchCategory(category.groups, [...parentArgs, category]);
                    if (found) return found;
                }
                // Search in items (often they are terminal, but some redundant structure exists)
                if (category.items) {
                    const foundItem = category.items.find((i: any) => i.slug === targetSlug);
                    if (foundItem) {
                        // Found a terminal item, treat as intent
                        return { type: 'intent', data: { ...foundItem, description: category.name }, parent: category, crumbs: [...parentArgs, category, foundItem] };
                    }
                }
            }
            return null;
        }

        // Iterate through all worlds to find the targetSlug
        for (const w of Object.values(CATEGORY_TAXONOMY)) {
            // If we found the world earlier, we can optimize, but general search is safer for deep links
            const found = searchCategory([w], []);
            if (found) return found;
        }

        return { type: 'unknown', data: null };
    };

    const result = findDeepCategoryData(slug);
    const parentSlug = slug.join('/');

    if (!result || result.type === 'unknown') {
        return <div className="min-h-screen pt-[var(--header-height)] flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-navy-900 mb-2">Category Not Found</h2>
                <Link href="/worlds" className="text-coral-500 hover:underline">Explore Worlds</Link>
            </div>
        </div>;
    }

    const { type, data, crumbs } = result;
    const worldData = data as any;
    const intentItems = worldData.intents || worldData.subcategories || worldData.items || [];
    // If it's a terminal category (has no sub-items but is an intent), default to empty for grid logic
    const isTerminal = !worldData.intents && !worldData.subcategories;

    // --- MOCK PRODUCT GENERATOR ---
    const getMockProducts = (categorySlug: string, categoryName: string) => {
        // Simple heuristic to make products look relevant
        const basePrice = 499;
        const products = Array.from({ length: 12 }).map((_, i) => {
            let name = `${categoryName} Item ${i + 1}`;
            let price = basePrice + (i * 150);

            // Contextual Naming
            if (categoryName.includes("Frame") || categoryName.includes("Wall")) name = `Art Frame Type-${String.fromCharCode(65 + i)}`;
            if (categoryName.includes("Mug")) name = `Ceramic Mug ${i + 1}00ml`;
            if (categoryName.includes("Tee")) name = `Graphic Tee Design #${i + 42}`;
            if (categoryName.includes("Case")) name = `Protective Case Series ${i + 1}`;

            return {
                id: `prod-${categorySlug}-${i}`,
                name: name,
                brand: "BroncStudio",
                price: price,
                originalPrice: i % 3 === 0 ? price + 200 : undefined,
                image: getProductImage(i),
                badge: i === 0 ? 'Best Seller' : i === 4 ? 'New' : undefined
            };
        });
        return products;
    };

    const products = type === 'intent' || isTerminal ? getMockProducts(worldData.slug, worldData.name) : [];

    return (
        <div className="relative min-h-screen pt-[var(--header-height)] pb-20">
            <AmbientBackground />

            {/* Breadcrumbs - Sticky (72px offset) */}
            <div className="sticky top-[72px] z-40 px-6 py-4 pointer-events-none">
                <div className="max-w-fit mx-auto px-6 py-2 bg-white/70 backdrop-blur-[18px] rounded-full shadow-sm border border-white/50 pointer-events-auto flex items-center space-x-2 text-sm text-navy-700 font-medium">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    {crumbs?.map((c: any) => <span key={c.slug || c.name} className="capitalize">{c.name}</span>)}
                </div>
            </div>

            {/* HERO SECTION: Strict Height 420px */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 h-[420px] flex flex-col justify-center text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {type === 'world' && <div className="text-sm font-bold tracking-widest uppercase mb-4 text-coral-500">World</div>}
                    <h1 className="text-[42px] font-heading font-bold text-navy-900 mb-4 leading-tight">
                        {data?.name}
                    </h1>
                    <p className="text-[16px] text-gray-600 max-w-[520px] mx-auto leading-relaxed">
                        {worldData?.description || `Explore our exclusive collection of ${worldData.name}.`}
                    </p>
                </motion.div>
            </div>

            {/* CONTENT: Max Width 1200px */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6">

                {/* A. WORLD VIEW: Intent Grid */}
                {type === 'world' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                        {intentItems.map((item: any) => (
                            <Link key={item.slug} href={`/shop/${item.slug}`} className="block">
                                <GlassCard className="h-[200px] flex flex-col justify-center items-center text-center p-6 bg-white/72 backdrop-blur-[18px]">
                                    <h3 className="text-2xl font-heading text-navy-900 mb-2">{item.name}</h3>
                                    {item.description && <p className="text-[10px] text-navy-800/60 font-bold uppercase tracking-wider mb-4">{item.description}</p>}
                                    <span className="text-sm text-coral-500 font-bold">Explore &rarr;</span>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                )}

                {/* B. PRODUCT GRID: 4 Cols, Gap 24px, Solid Cards */}
                {(type === 'intent' || isTerminal) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px]">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                brand={product.brand}
                                price={product.price}
                                originalPrice={product.originalPrice}
                                image={product.image}
                                badge={product.badge}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
