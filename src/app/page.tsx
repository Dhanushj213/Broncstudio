import React from 'react';
import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
    title: 'BroncStudio | Premium Apparel, Tech & Home Essentials',
    description: 'Explore our wide range of premium products including apparel, tech accessories, and home decor. Designed for style, crafted for you.',
    openGraph: {
        title: 'BroncStudio | Premium Apparel, Tech & Home Essentials',
        description: 'Shop premium apparel for men, women, and kids, plus unique tech accessories, home decor, and gifts. Elevate your everyday style.',
        images: ['/og-image.jpg'],
    }
};

export default async function HomePage() {
    const supabase = await createClient();

    // 1. Fetch Hero
    const { data: heroBlock } = await supabase
        .from('content_blocks')
        .select('content')
        .eq('section_id', 'hero_main')
        .single();

    // 2. Fetch New Arrivals
    const { data: newArrivals } = await supabase
        .from('products')
        .select('*')
        .contains('metadata', { is_new_arrival: true })
        .limit(12);

    // 3. Fetch Featured Products
    const { data: featuredProducts } = await supabase
        .from('products')
        .select('*')
        .contains('metadata', { is_featured: true })
        .limit(28);

    // 4. Fetch Drop Data
    const { data: dropBlock } = await supabase
        .from('content_blocks')
        .select('content')
        .eq('section_id', 'limited_drop')
        .single();

    // 5. Fetch Curated Sections
    const { data: curatedSections } = await supabase
        .from('curated_sections')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    // 6. Fetch Bento Grid
    const { data: bentoBlock } = await supabase
        .from('content_blocks')
        .select('content')
        .eq('section_id', 'bento_grid')
        .single();

    // 7. Fetch Special Collections Data
    const { data: collections } = await supabase
        .from('special_collections')
        .select('id, name, slug')
        .eq('is_active', true);

    let specialProducts: any[] = [];
    if (collections && collections.length > 0) {
        const collectionMap: Record<string, any> = collections.reduce((acc: any, c: any) => ({ ...acc, [c.id]: c }), {});
        const { data: mappings } = await supabase
            .from('special_collection_products')
            .select('collection_id, product_id, products(*)')
            .in('collection_id', Object.keys(collectionMap))
            .order('created_at', { ascending: false })
            .limit(8);

        if (mappings) {
            const formatted = mappings.map((m: any) => ({
                ...m.products,
                special_badge: collectionMap[m.collection_id].name,
                special_slug: collectionMap[m.collection_id].slug
            }));
            const uniqueIds = new Set();
            specialProducts = formatted.filter(p => {
                if (uniqueIds.has(p.id)) return false;
                uniqueIds.add(p.id);
                return true;
            });
        }
    }

    return (
        <HomeClient
            initialHeroContent={heroBlock?.content}
            initialNewArrivals={newArrivals?.map(p => ({
                id: p.id,
                name: p.name,
                brand: 'BroncStudio',
                price: p.price,
                originalPrice: p.compare_at_price,
                image: p.images?.[0] || '/images/placeholder.jpg',
                images: p.images || [],
                badge: 'New',
                metadata: p.metadata,
            }))}
            initialFeaturedProducts={featuredProducts?.map(p => ({
                id: p.id,
                name: p.name,
                brand: 'BroncStudio',
                price: p.price,
                originalPrice: p.compare_at_price,
                image: p.images?.[0] || '/images/placeholder.jpg',
                images: p.images || [],
                metadata: p.metadata,
            }))}
            initialDropData={dropBlock?.content}
            initialCuratedSections={curatedSections || []}
            initialSpecialCollections={specialProducts}
            initialBentoData={bentoBlock?.content?.tiles || []}
        />
    );
}
