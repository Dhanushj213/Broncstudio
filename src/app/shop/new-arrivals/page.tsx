'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ProductCard from '@/components/Product/ProductCard';
import BrandLoader from '@/components/UI/BrandLoader';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NewArrivalsPage() {
    const router = useRouter();
    const supabase = createClient();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            setLoading(true);

            // 1. Fetch Manual "new-arrival" tag
            const { data: manualData } = await supabase
                .from('products')
                .select('*')
                .contains('metadata', { tags: ['new-arrival'] });

            // 2. Fetch latest 50 products (Automatic)
            const { data: autoData } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            // 3. Merge: Manual first, then Auto (Dedupe by ID)
            const combined = [...(manualData || []), ...(autoData || [])];
            const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

            setProducts(unique);
            setLoading(false);
        };

        fetchNewArrivals();
    }, []);

    if (loading) return <BrandLoader text="Unboxing new drops..." />;

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-black pb-20 overflow-hidden">
            <AmbientBackground />
            {/* Background Blob */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-coral-500/10 blur-3xl opacity-50 pointer-events-none" />

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center text-center">
                <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                    alt="New Arrivals"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-black to-transparent z-10" />

                <div className="relative z-10 px-6 max-w-4xl mx-auto text-white">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 mb-6 shadow-lg">
                        <Sparkles size={16} className="text-yellow-300" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white">Fresh Drops</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
                        The New Standard.
                    </h1>
                    <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                        Be the first to snag the latest styles added to our collection. Innovative designs for the modern legend.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                    {products.map((product, idx) => (
                        <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                brand="BroncStudio"
                                price={product.price}
                                originalPrice={product.compare_at_price}
                                image={product.images?.[0] || product.image_url || '/images/placeholder.jpg'}
                                badge="New"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
