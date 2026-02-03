'use client';

import React from 'react';
import { ProductGalleryOptimized as ProductGallery } from '@/components/Product/Page/ProductGallery';
import ProductInfo from '@/components/Product/Page/ProductInfo';
import StickyActionBar from '@/components/Product/Page/StickyActionBar';
import MiniTrustStrip from '@/components/Product/Page/MiniTrustStrip';
import ShopTheLook from '@/components/Product/ShopTheLook';
import ProductShowcase from '@/components/Home/ProductShowcase';
import { getProductImage } from '@/utils/sampleImages';

import { createBrowserClient } from '@supabase/ssr';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProductPage() {
    const params = useParams(); // params.id may be undefined initially
    const id = params?.id as string;
    const router = useRouter();
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (!id) return;

        const fetchProductAndRelated = async () => {
            setLoading(true);

            // 1. Fetch Main Product
            const { data: mainProduct, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !mainProduct) {
                console.error('Error fetching product:', error);
                setProduct(null);
                setLoading(false);
                return;
            }

            setProduct(mainProduct);

            // 2. Fetch Related Products (Same Category)
            if (mainProduct.category_id) {
                const { data: related } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category_id', mainProduct.category_id)
                    .neq('id', id) // Exclude current
                    .limit(8);

                if (related) {
                    // Map to ensure valid image format if needed
                    const mappedRelated = related.map((p: any) => ({
                        ...p,
                        image: p.images?.[0] || p.image_url || '/images/placeholder.jpg',
                        secondaryImage: p.images?.[1],
                        originalPrice: p.compare_at_price
                    }));
                    setRelatedProducts(mappedRelated);
                }
            }

            setLoading(false);
        };

        fetchProductAndRelated();
    }, [id]);

    const handleAddFromSticky = () => {
        if (!product) return;
        addToCart(product, product.metadata?.sizes?.[0] || 'Default');
        addToast(`${product.name} added to your bag!`, 'success');
    };

    const handleBuyNow = () => {
        if (!product) return;
        addToCart(product, product.metadata?.sizes?.[0] || 'Default');
        router.push('/cart');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-navy-900" size={32} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <h1 className="text-2xl font-bold text-navy-900 mb-4">Product Not Found</h1>
                <p className="text-gray-500">The product you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <main className="bg-white min-h-screen pb-8 md:pb-0 pt-[var(--header-height)]">
            {/* Main Product Section */}
            <div className="container-premium max-w-[1200px] mx-auto px-4 md:px-6 pt-6 md:pt-12 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
                    {/* Left: Gallery */}
                    <div className="w-full">
                        <ProductGallery images={product.images || [product.image_url || '/images/placeholder.jpg']} />
                    </div>

                    {/* Right: Info (Sticky) */}
                    <div className="px-0 sticky top-32">
                        <ProductInfo product={product} />
                    </div>
                </div>
            </div>

            {/* Shop The Look (Dynamic Contextual Engine) */}
            <ShopTheLook product={product} />

            {/* Similar Products */}
            {relatedProducts.length > 0 && (
                <ProductShowcase
                    title="You May Also Like"
                    subtitle="Customers who bought this also checked out these styles."
                    products={relatedProducts}
                    className="bg-gray-50/30"
                    layout="carousel"
                />
            )}

            {/* Trust Strip */}
            <MiniTrustStrip />

            {/* Mobile Sticky Bar */}
            <StickyActionBar
                price={product.price}
                originalPrice={product.compare_at_price}
                productName={product.name}
                productImage={product.images?.[0] || product.image_url || '/images/placeholder.jpg'}
                onAddToCart={handleAddFromSticky}
                onBuyNow={handleBuyNow}
            />
        </main>
    );
}
