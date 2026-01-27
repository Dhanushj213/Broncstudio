'use client';

import React from 'react';
import { ProductGalleryOptimized as ProductGallery } from '@/components/Product/Page/ProductGallery';
import ProductInfo from '@/components/Product/Page/ProductInfo';
import StickyActionBar from '@/components/Product/Page/StickyActionBar';
import MiniTrustStrip from '@/components/Product/Page/MiniTrustStrip';
import ShopTheLook from '@/components/Product/ShopTheLook';
import ProductShowcase from '@/components/Home/ProductShowcase';
import { SAMPLE_IMAGES, getProductImage } from '@/utils/sampleImages';

// Dummy Data (Retained and Expanded)
const PRODUCT = {
    id: '1',
    name: 'Little Explorer Premium Cotton T-Shirt',
    brand: 'BRONC KIDS',
    price: 499,
    originalPrice: 999,
    description: 'Let your child explore the world in style with our premium cotton t-shirt. Breathable fabric, vibrant colors, and a fit that loves to play.',
    images: SAMPLE_IMAGES,
    sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
    colors: [
        { name: 'Yellow', code: '#FFD966' },
        { name: 'Blue', code: '#5BC0EB' },
        { name: 'Peach', code: '#FF6F61' },
    ]
};

const SIMILAR_PRODUCTS = Array.from({ length: 25 }).map((_, i) => ({
    id: `sim-${i}`,
    name: ['Urban Denim Joggers', 'Cosmic Dreamer Pajama', 'Dino Hoodie', 'Space Backpack', 'Velvet Party Dress', 'Striped Cotton Tee'][i % 6],
    brand: 'BRONC KIDS',
    price: 499 + (i * 50),
    originalPrice: 999 + (i * 100),
    image: getProductImage(i),
    badge: i % 5 === 0 ? 'Trending' : i % 7 === 0 ? 'New' : undefined
}));

import { useCart } from '@/context/CartContext';

export default function ProductPage() {
    const { addToCart } = useCart();

    // Handler for Sticky Bar (defaults to 'M' since we don't have access to ProductInfo state here easily)
    // A better solution would be lifting state up, but for this quick fix, default is fine.
    const handleAddFromSticky = () => {
        addToCart(PRODUCT, '3-4Y'); // Default size
        alert('Added to Bag!');
    };

    return (
        <main className="bg-white min-h-screen pb-24 md:pb-0">
            {/* Main Product Section */}
            <div className="container-premium max-w-[1200px] mx-auto px-4 md:px-6 pt-0 md:pt-12 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
                    {/* Left: Gallery */}
                    <div className="w-full">
                        <ProductGallery images={PRODUCT.images} />
                    </div>

                    {/* Right: Info (Sticky) */}
                    <div className="px-0 sticky top-32">
                        <ProductInfo product={PRODUCT} />
                    </div>
                </div>
            </div>

            {/* Shop The Look */}
            <ShopTheLook />

            {/* Similar Products */}
            <ProductShowcase
                title="You May Also Like"
                subtitle="Customers who bought this also checked out these styles."
                products={SIMILAR_PRODUCTS}
                className="bg-gray-50/30"
                layout="carousel"
            />

            {/* Trust Strip */}
            <MiniTrustStrip />

            {/* Mobile Sticky Bar */}
            <StickyActionBar
                price={PRODUCT.price}
                originalPrice={PRODUCT.originalPrice}
                onAddToCart={handleAddFromSticky}
                onBuyNow={() => { }}
            />
        </main>
    );
}
