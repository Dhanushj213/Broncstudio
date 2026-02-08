import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/Product/ProductCard';
import { ShoppingBag, Check, Plus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { getRecommendations } from '@/lib/recommendations';
import { formatPrice } from '@/utils/formatPrice';

interface ShopTheLookProps {
    product: any;
}

export default function ShopTheLook({ product }: ShopTheLookProps) {
    const { addToCart } = useCart();
    const { addToast } = useToast();

    // State for Dynamic Recommendations
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLooks = async () => {
            if (!product) return;
            setLoading(true);
            const recs = await getRecommendations(product);
            setItems(recs);
            setLoading(false);
        };
        fetchLooks();
    }, [product]);

    if (loading) return null; // Or a skeleton/loader if desired
    if (items.length === 0) return null; // Don't show if no matches

    const bundleTotal = items.reduce((sum, item) => sum + item.price, 0) + product.price;

    const handleAddBundle = () => {
        // Add Main Product
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            qty: 1,
            size: product.metadata?.sizes?.[0] || 'One Size',
            color: product.metadata?.colors?.[0]?.name || 'Default'
        }, product.metadata?.sizes?.[0] || 'One Size');

        // Add Recommendations
        items.forEach(item => {
            const size = item.metadata?.sizes?.[0] || 'One Size';
            addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.images?.[0] || item.image || '',
                qty: 1,
                size: size,
                color: item.metadata?.colors?.[0]?.name || 'Default'
            }, size);
        });
        addToast('Complete look added to your bag!', 'success');
    };

    return (
        <section className="py-12 md:py-16 bg-gray-50/50">
            <div className="container-premium max-w-[1200px] mx-auto px-4">
                <div className="mb-8 md:mb-10 text-center">
                    <span className="text-coral-500 font-bold uppercase tracking-widest text-xs mb-2 block">Curated Style</span>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy-900">Complete the Look</h2>
                    <p className="text-sm md:text-base text-gray-500 mt-2">Handpicked essentials that look better together.</p>
                </div>

                {/* --- MOBILE LAYOUT (Amazon Style) --- */}
                <div className="block md:hidden bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-navy-900 mb-4 text-sm uppercase tracking-wide">Buy it with</h3>

                    {/* Image Row */}
                    <div className="flex items-center justify-between gap-1 mb-6">
                        {/* Main Product */}
                        <div className="relative flex-1 aspect-[3/4] rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                            <Image
                                src={product.images?.[0] || ''}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-navy-900/80 text-white text-[10px] font-bold text-center py-1">THIS</div>
                        </div>

                        {items.map((item, i) => (
                            <React.Fragment key={item.id}>
                                <div className="text-gray-400 flex-shrink-0"><Plus size={14} /></div>
                                <div className="relative flex-1 aspect-[3/4] rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                                    <Image
                                        src={item.images?.[0] || item.image || ''}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Price Summary */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="text-lg font-bold text-navy-900">
                            Total price: <span className="text-red-600">{formatPrice(bundleTotal)}</span>
                        </div>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={handleAddBundle}
                        className="w-full py-3 bg-navy-900 text-white font-bold rounded-xl shadow-lg hover:bg-navy-800 transition-colors flex items-center justify-center gap-2 mb-4 text-sm"
                    >
                        Add all {items.length + 1} to Bag
                    </button>

                    {/* Checklist */}
                    <div className="space-y-3">
                        {/* Main Item */}
                        <div className="flex items-start gap-2 text-sm">
                            <div className="mt-0.5 w-4 h-4 rounded bg-navy-900/10 flex items-center justify-center text-navy-900">
                                <Check size={10} strokeWidth={4} />
                            </div>
                            <div className="leading-tight">
                                <span className="font-medium text-navy-900">This item: {product.name}</span>
                                <span className="text-gray-400 mx-1">-</span>
                                <span className="font-bold text-red-600">{formatPrice(product.price)}</span>
                            </div>
                        </div>
                        {/* Recommendations */}
                        {items.map((item) => (
                            <div key={item.id} className="flex items-start gap-2 text-sm">
                                <div className="mt-0.5 w-4 h-4 rounded bg-navy-900/10 flex items-center justify-center text-navy-900">
                                    <Check size={10} strokeWidth={4} />
                                </div>
                                <div className="leading-tight">
                                    <span className="font-medium text-navy-900">{item.name}</span>
                                    <span className="text-gray-400 mx-1">-</span>
                                    <span className="font-bold text-red-600">{formatPrice(item.price)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* --- DESKTOP LAYOUT --- */}
                <div className="hidden md:flex flex-col lg:flex-row gap-8 items-start">
                    {/* Look Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {items.map((item, i) => (
                            <div key={item.id} className="relative">
                                {i < items.length - 1 && (
                                    <div className="absolute top-1/2 -right-3 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-400 font-bold shadow-sm translate-x-1/2 -translate-y-1/2">+</div>
                                )}
                                <ProductCard {...item} />
                            </div>
                        ))}
                    </div>

                    {/* Bundle Action */}
                    <div className="w-full lg:w-[300px] bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center sticky top-24">
                        <h3 className="font-bold text-navy-900 mb-4">Complete Bundle</h3>
                        <div className="text-sm text-gray-500 mb-6 space-y-1">
                            <div className="flex justify-between w-full font-bold">
                                <span>{product.name}</span>
                                <span>{formatPrice(product.price)}</span>
                            </div>
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between w-full">
                                    <span>{item.name}</span>
                                    <span>{formatPrice(item.price)}</span>
                                </div>
                            ))}
                            <div className="border-t border-gray-100 pt-2 flex justify-between w-full font-bold text-navy-900 mt-2">
                                <span>Total</span>
                                <span>{formatPrice(bundleTotal)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleAddBundle}
                            className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-coral-500 transition-colors flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl"
                        >
                            <ShoppingBag size={20} /> Add All {items.length + 1} to Bag
                        </button>
                        <p className="text-xs text-green-600 font-bold mt-3">You save 15% on this bundle!</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
