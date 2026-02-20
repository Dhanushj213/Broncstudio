import React from 'react';
import type { Metadata } from 'next';
import ProductClient from './ProductClient';
import { createClient } from '@/utils/supabase/server';

// Fetch product data for Metadata
async function getProduct(id: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found | BroncStudio',
            description: 'The product you are looking for does not exist.'
        };
    }

    const title = `${product.name} | BroncStudio`;
    const description = product.description?.slice(0, 160) || `Buy ${product.name} online at BroncStudio. Premium quality kids clothing.`;
    const image = product.images?.[0] || '/og-image.jpg';

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [{ url: image }],
            type: 'website',
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    // JSON-LD Structured Data for Product
    const jsonLd = product ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images?.[0],
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: 'BroncStudio'
        },
        offers: {
            '@type': 'Offer',
            url: `https://broncstudio.com/product/${product.id}`,
            priceCurrency: 'INR',
            price: product.price,
            availability: (product.is_sold_out || product.stock_status !== 'out_of_stock') ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition'
        }
    } : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ProductClient />
        </>
    );
}
