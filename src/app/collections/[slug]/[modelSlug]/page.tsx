'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import GlassCard from '@/components/UI/GlassCard';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/Product/ProductCard';
import { createClient } from '@/utils/supabase/client';
import { LayoutGrid, SlidersHorizontal, ChevronRight } from 'lucide-react';
import BrandLoader from '@/components/UI/BrandLoader';
import SortBar, { SortOption } from '@/components/Collection/SortBar';

export default function ModelCollectionPage() {
    const params = useParams();
    const brandSlugRaw = params?.slug as string;
    const modelSlug = params?.modelSlug as string;

    const [brand, setBrand] = useState<any>(null);
    const [model, setModel] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState<SortOption>('featured');

    const supabase = createClient();

    useEffect(() => {
        if (!brandSlugRaw || !modelSlug) return;

        const fetchData = async () => {
            setLoading(true);
            const brandSlug = brandSlugRaw.replace('-cases', '');

            // 1. Fetch Brand and Model
            const { data: bData } = await supabase.from('brands').select('*').eq('slug', brandSlug).single();
            const { data: mData } = await supabase.from('device_models').select('*').eq('slug', modelSlug).single();

            if (!bData || !mData) {
                setLoading(false);
                return;
            }

            setBrand(bData);
            setModel(mData);

            // 2. Fetch Compatible Products
            const { data: compProducts } = await supabase
                .from('product_compatibility')
                .select('product_id')
                .eq('device_model_id', mData.id);

            const productIds = (compProducts || []).map((cp: any) => cp.product_id);

            if (productIds.length > 0) {
                const { data: pData } = await supabase
                    .from('products')
                    .select('id, name, price, compare_at_price, images, stock_status, created_at, category_id, metadata')
                    .in('id', productIds);
                setProducts(pData || []);
            } else {
                setProducts([]);
            }

            setLoading(false);
        };

        fetchData();
    }, [brandSlugRaw, modelSlug]);

    const filteredProducts = useMemo(() => {
        let result = [...products];
        switch (sortOption) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'alpha-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'alpha-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
            case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
        }
        return result;
    }, [products, sortOption]);

    if (loading) return <BrandLoader text="Loading Model Catalog..." />;

    if (!brand || !model) {
        return (
            <div className="min-h-screen pt-[var(--header-height)] flex items-center justify-center bg-background">
                <div className="text-center">
                    <h2 className="text-3xl font-heading font-bold text-primary mb-2">Model Not Found</h2>
                    <Link href="/collections/phone-cases" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:bg-coral-500 transition-all inline-block mt-4">
                        View All Cases
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-background pt-[120px] -mt-[120px] pb-20 overflow-hidden">
            <AmbientBackground />

            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-coral-500/10 via-orange-500/5 to-amber-500/10 blur-3xl opacity-40 pointer-events-none z-0" />

            {/* Breadcrumbs */}
            <div className="relative z-40 px-6 py-4 container-premium mx-auto">
                <div className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-2">
                    <Link href="/" className="hover:text-coral-500 transition-colors">Home</Link>
                    <ChevronRight size={10} className="text-subtle" />
                    <Link href="/collections/phone-cases" className="hover:text-coral-500 transition-colors">Phone Cases</Link>
                    <ChevronRight size={10} className="text-subtle" />
                    <Link href={`/collections/${brandSlugRaw}`} className="hover:text-coral-500 transition-colors">{brand.name}</Link>
                    <ChevronRight size={10} className="text-subtle" />
                    <span className="text-primary">{model.name}</span>
                </div>
            </div>

            <div className="container-premium mx-auto px-4 md:px-6 mt-8">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-primary mb-4">
                        {model.name} <span className="text-coral-500">Cases</span>
                    </h1>
                    <p className="text-secondary max-w-2xl text-lg">
                        Premium protection and personalized designs for your {brand.name} {model.name}.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar with other models from same brand */}
                    <aside className="lg:w-64 flex-shrink-0">
                        {/* We could fetch other models here but for now keeping it simple */}
                    </aside>

                    <div className="flex-1">
                        <SortBar
                            totalProducts={filteredProducts.length}
                            sortOption={sortOption}
                            onSortChange={setSortOption}
                        />

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
                                            image={product.images?.[0] || '/images/placeholder.jpg'}
                                            secondaryImage={product.images?.[1]}
                                            badge={product.stock_status === 'out_of_stock' ? 'Sold Out' : undefined}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-subtle rounded-3xl">
                                <h3 className="text-xl font-bold text-secondary">No cases found for this model</h3>
                                <p className="text-subtle mt-2">Try checking the brand collection for more options.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
