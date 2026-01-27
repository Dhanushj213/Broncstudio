'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AmbientBackground from '@/components/UI/AmbientBackground';
import BrandLoader from '@/components/UI/BrandLoader';
import ProductCard from '@/components/Product/ProductCard';
import { createClient } from '@/utils/supabase/client';
import { LayoutGrid, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Metadata for Curated Feeds
const CURATED_META: Record<string, { title: string; description: string }> = {
    'old-money': { title: 'Old Money Aesthetic', description: 'Timeless elegance and quiet luxury.' },
    'office-edit': { title: 'The Office Edit', description: 'Professional fits that mean business.' },
    'concert-fits': { title: 'Concert Fits', description: 'Stand out in the crowd.' },
    'culture-code': { title: 'Culture Code', description: 'Streetwear essentials defined by you.' }
};

export default function CuratedFeedPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const meta = CURATED_META[slug] || { title: 'Curated Collection', description: 'Handpicked just for you.' };

    const supabase = createClient();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            // In a real scenario, we might query by specific tags or curated IDs.
            // For now, we'll fetch random products to simulate a "feed"
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .limit(20); // Fetch a batch

            if (error) console.error(error);

            // Randomize for "Discovery" feel
            const shuffled = data ? data.sort(() => 0.5 - Math.random()) : [];
            setProducts(shuffled);
            setLoading(false);
        };
        fetchProducts();
    }, [slug]);

    if (loading) return <BrandLoader text="Curating your feed..." />;

    return (
        <div className="min-h-screen bg-background pt-[var(--header-height)] pb-20">
            <AmbientBackground />

            {/* Header */}
            <div className="sticky top-[72px] z-30 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-navy-900 dark:text-white" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold font-heading text-navy-900 dark:text-white leading-none">
                            {meta.title}
                        </h1>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{meta.description}</p>
                    </div>
                </div>
            </div>

            {/* Feed Grid */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
                    {products.length > 0 ? products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                brand="BroncStudio"
                                price={product.price}
                                originalPrice={product.compare_at_price}
                                image={product.images?.[0] || product.image_url || '/images/placeholder.jpg'}
                                badge={idx % 5 === 0 ? 'Editor Pick' : undefined}
                            />
                        </motion.div>
                    )) : (
                        <div className="col-span-full text-center py-20 text-gray-400">
                            <LayoutGrid size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Curating products for you...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
