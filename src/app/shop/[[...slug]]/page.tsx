import React from 'react';
import type { Metadata } from 'next';
import ShopClient from './ShopClient';
import { CATEGORY_TAXONOMY } from '@/data/categories';
import { createClient } from '@/utils/supabase/server';

// Helper to resolve taxonomy title/description based on slug
const resolveMetadata = async (slugArray: string[]) => {
    // 1. Root
    if (!slugArray || slugArray.length === 0) {
        return {
            title: 'Shop All Categories',
            description: 'Explore our curated collections of premium kids clothing.',
            image: '/og-image.jpg' // Default
        };
    }

    const [l1Slug, l2Slug, l3Slug] = slugArray;

    // 2. Level 1 (Category)
    const l1Node = Object.values(CATEGORY_TAXONOMY).find(c => c.slug === l1Slug);
    if (!l1Node) return null; // 404

    if (slugArray.length === 1) {
        return {
            title: l1Node.name,
            description: l1Node.description || `Shop ${l1Node.name} at BroncStudio.`,
            image: l1Node.image
        };
    }

    // 3. Level 2 (Subcategory)
    const l2Node = l1Node.subcategories?.find((sc: any) => sc.slug === l2Slug);
    if (!l2Node) return null;

    if (slugArray.length === 2) {
        return {
            title: `${l2Node.name} - ${l1Node.name}`,
            description: (l2Node as any).description || `Browse ${l2Node.name} in ${l1Node.name}.`,
            image: l1Node.image // Fallback to category image
        };
    }

    // 4. Level 3 (Item / Product Type)
    const l3Node = l2Node.items?.find((item: any) => item.slug === l3Slug);
    if (l3Node) {
        return {
            title: `${l3Node.name} - ${l2Node.name}`,
            description: `Shop ${l3Node.name} for kids.`,
            image: l1Node.image
        };
    }

    return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
    const { slug = [] } = await params;
    const meta = await resolveMetadata(slug);

    if (!meta) {
        return {
            title: 'Page Not Found',
            description: 'The requested collection could not be found.'
        };
    }

    return {
        title: meta.title,
        description: meta.description,
        openGraph: {
            title: `${meta.title} | BroncStudio`,
            description: meta.description,
            images: meta.image ? [{ url: meta.image }] : [],
            type: 'website',
        },
    };
}

export default function ShopPageWrapper() {
    return <ShopClient />;
}
