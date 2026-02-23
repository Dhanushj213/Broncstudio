import React from 'react';
import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ClientSpecialCategory from './ClientSpecialCategory';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );

    const { data: col } = await supabase
        .from('special_collections')
        .select('name, seo_title, seo_description, banner_image')
        .eq('slug', slug)
        .single();

    if (!col) return { title: 'Collection Not Found | BroncStudio' };

    return {
        title: col.seo_title || `${col.name} | BroncStudio Special Edition`,
        description: col.seo_description || `Discover the exclusive ${col.name} collection at BroncStudio.`,
        openGraph: {
            title: col.seo_title || `${col.name} | Special Collection`,
            images: col.banner_image ? [col.banner_image] : [],
        }
    };
}

export default async function SpecialCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <ClientSpecialCategory slug={slug} />;
}
