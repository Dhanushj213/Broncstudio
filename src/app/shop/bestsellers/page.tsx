'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ProductCard from '@/components/Product/ProductCard';
import BrandLoader from '@/components/UI/BrandLoader';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

export default function BestsellersPage() {
    const router = useRouter();
    const supabase = createClient();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [heroImage, setHeroImage] = useState('');

    useEffect(() => {
        const fetchBestsellers = async () => {
            setLoading(true);

            // 0. Fetch Dynamic Hero Image
            const { data: heroData } = await supabase
                .from('content_blocks')
                .select('content')
                .eq('section_id', 'shop_hero_images')
                .single();

            if (heroData?.content) {
                const dynamicHero = (heroData.content as Record<string, string>)['bestsellers'];
                if (dynamicHero) setHeroImage(dynamicHero);
            }

            // Fetch random products to simulate "Popular" (since no sales data)
            // Ideally we would order by 'sales_count' desc
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .limit(50);

            if (error) {
                console.error('Error fetching bestsellers:', error);
            }

            // Manual shuffle to make it look curated/randomized
            const shuffled = data ? data.sort(() => 0.5 - Math.random()) : [];

            setProducts(shuffled);
            setLoading(false);
        };

        fetchBestsellers();
    }, []);

    if (loading) return <BrandLoader text="Rounding up the favorites..." />;

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-black pb-20 overflow-hidden">
            <AmbientBackground />
            {/* Background Blob */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 blur-3xl opacity-50 pointer-events-none" />

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center text-center">
                {heroImage ? (
                    <Image
                        src={getGoogleDriveDirectLink(heroImage)}
                        alt="Bestsellers"
                        fill
                        priority
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-navy-900" />
                )}
                <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-black to-transparent z-10" />

                <div className="relative z-10 px-6 max-w-4xl mx-auto text-white">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 mb-6 shadow-lg">
                        <TrendingUp size={16} className="text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white">Top Rated</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
                        Crowd Favorites.
                    </h1>
                    <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                        The pieces everyone’s talking about. Validated by thousands of happy customers.
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
                                badge={idx < 5 ? 'Hot' : undefined}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
