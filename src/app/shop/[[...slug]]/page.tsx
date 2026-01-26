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

export default function ShopPage() {
    const { formatPrice } = useUI();
    const params = useParams();
    const rawSlug = params?.slug;
    const slugArray = Array.isArray(rawSlug) ? rawSlug : rawSlug ? [rawSlug] : [];
    const targetSlug = slugArray[slugArray.length - 1];

    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<any>(null);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(false);

            try {
                // 1. Handle Root /shop
                // 1. Handle Root /shop
                if (!targetSlug) {
                    setCategory({ name: 'Shop Worlds', description: 'Explore our entire collection of themes.' });

                    // Fetch all worlds
                    const { data: worldsData, error: worldsError } = await supabase
                        .from('categories')
                        .select('*')
                        .eq('type', 'world');

                    if (worldsError) {
                        console.error("Worlds fetch error:", worldsError);
                    } else {
                        setSubcategories(worldsData || []);
                    }

                    setLoading(false);
                    return;
                }

                // 2. Fetch Category
                const { data: catData, error: catError } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('slug', targetSlug)
                    .single();

                if (catError || !catData) {
                    console.error("Category fetch error:", catError);
                    setError(true);
                    setLoading(false);
                    return;
                }

                setCategory(catData);

                // 3. Fetch Subcategories (World -> Intents/Subcategories)
                const { data: subData } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('parent_id', catData.id);

                setSubcategories(subData || []);

                // 4. Fetch Products (if it's a leaf or has products)
                // Note: If it's a World, we might not show products directly, but Intents.
                const { data: prodData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category_id', catData.id);

                setProducts(prodData || []);

            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [targetSlug]);


    if (loading) {
        return (
            <div className="min-h-screen pt-[var(--header-height)] flex items-center justify-center bg-background">
                <BrandLoader text="Loading Catalog" />
            </div>
        );
    }

    if (error || (!category && targetSlug)) {
        return (
            <div className="min-h-screen pt-[var(--header-height)] flex items-center justify-center bg-background">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-navy-900 mb-2">Category Not Found</h2>
                    <p className="text-gray-500 mb-6">We couldn't find the page you're looking for.</p>
                    <Link href="/worlds" className="px-6 py-3 bg-navy-900 text-white rounded-full font-bold hover:bg-coral-500 transition-colors">
                        Explore Worlds
                    </Link>
                </div>
            </div>
        );
    }

    // Determine View Type
    // If it has Subcategories (like a World or Intent), show them.
    // If it has Products (leaf), show Product Grid.
    const showSubcategories = subcategories.length > 0;
    const showProducts = products.length > 0 && !showSubcategories; // Prefer subcategories if mix exists? Or show both.

    // Fallback: If no subcategories and no products, show empty state or parent logic

    return (
        <div className="relative min-h-screen pt-[var(--header-height)] pb-20 bg-background">
            <AmbientBackground />

            {/* Breadcrumbs - Simple Version */}
            <div className="sticky top-[72px] z-40 px-6 py-4 pointer-events-none">
                <div className="max-w-fit mx-auto px-6 py-2 bg-white/70 backdrop-blur-[18px] rounded-full shadow-sm border border-white/50 pointer-events-auto flex items-center space-x-2 text-sm text-navy-700 font-medium">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <Link href="/shop">Shop</Link>
                    {targetSlug && (
                        <>
                            <span>/</span>
                            <span className="capitalize text-coral-500">{category?.name}</span>
                        </>
                    )}
                </div>
            </div>

            {/* HERO SECTION */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-12 flex flex-col justify-center text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {category?.type === 'world' && <div className="text-sm font-bold tracking-widest uppercase mb-4 text-coral-500">World</div>}
                    <h1 className="text-4xl md:text-[42px] font-heading font-bold text-navy-900 mb-4 leading-tight">
                        {category?.name}
                    </h1>
                    <p className="text-[16px] text-gray-600 max-w-[520px] mx-auto leading-relaxed">
                        {category?.description || `Explore our collection of ${category?.name}.`}
                    </p>
                </motion.div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6">

                {/* A. SUBCATEGORIES GRID */}
                {showSubcategories && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-12">
                        {subcategories.map((item: any) => (
                            <Link key={item.id} href={`/shop/${slugArray.join('/')}/${item.slug}`} className="block">
                                <GlassCard className="h-[200px] flex flex-col justify-center items-center text-center p-6 bg-white/72 backdrop-blur-[18px] hover:border-coral-500/30 transition-colors">
                                    <h3 className="text-2xl font-heading text-navy-900 mb-2">{item.name}</h3>
                                    {item.description && <p className="text-[10px] text-navy-800/60 font-bold uppercase tracking-wider mb-4">{item.description}</p>}
                                    <span className="text-sm text-coral-500 font-bold">Explore &rarr;</span>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                )}

                {/* B. PRODUCT GRID */}
                {products.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px]">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                brand="BroncStudio" // brand column not in simplified schema, hardcode or add to DB
                                price={product.price}
                                originalPrice={product.compare_at_price}
                                image={product.images?.[0] || '/images/placeholder.jpg'}
                                badge={product.stock_status === 'out_of_stock' ? 'Sold Out' : undefined}
                            />
                        ))}
                    </div>
                )}

                {!showSubcategories && products.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <LayoutGrid size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No products found in this category yet.</p>
                        <p className="text-sm mt-2">Check back soon for new drops!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
