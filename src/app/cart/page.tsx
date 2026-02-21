'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import GlassCard from '@/components/UI/GlassCard';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';
import { useStoreSettings } from '@/context/StoreSettingsContext';

const CartPage = () => {
    const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { settings } = useStoreSettings();

    const shipping = cartTotal >= settings.free_shipping_threshold ? 0 : settings.shipping_charge;
    const tax = parseFloat((cartTotal * (settings.tax_rate / 100)).toFixed(2)); // Dynamic Tax Rate
    const total = cartTotal + shipping + tax;

    if (items.length === 0) {
        const WORLDS = [
            { name: 'Stationery & Play', subtitle: 'Curiosity & Play.', href: '/shop/kids', icon: '🎨', color: '#FFD966', image: '' },
            { name: 'Clothing', subtitle: 'Fashion for Everyone.', href: '/shop/clothing', icon: '👕', color: '#5BC0EB', image: '' },
            { name: 'Lifestyle', subtitle: 'Small Joys & Gifting.', href: '/shop/lifestyle', icon: '🎁', color: '#B392AC', image: '' },
            { name: 'Home & Tech', subtitle: 'Decor & Comfort.', href: '/shop/home', icon: '🏠', color: '#1B263B', image: '' },
            { name: 'Accessories', subtitle: 'Style Extras.', href: '/shop/accessories', icon: '🧢', color: '#9BC53D', image: '' },
            { name: 'Pets', subtitle: 'Furry Friends.', href: '/shop/pets', icon: '🐾', color: '#FF6B6B', image: '' },
        ];

        return (
            <div className="w-full min-h-[calc(100vh-72px)] bg-background relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8 mt-[var(--header-height)]">
                <AmbientBackground className="opacity-60" />

                {/* Empty State Card */}
                <GlassCard className="mx-auto p-8 md:p-12 text-center max-w-md w-full flex flex-col items-center shadow-xl border border-subtle relative z-10">
                    <div className="text-6xl mb-6 animate-bounce">🛍️</div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-3 leading-tight">Your Bag is Empty</h2>
                    <p className="text-secondary font-medium mb-8 leading-relaxed">
                        Looks like you haven't discovered our treasures yet!
                        <br className="hidden md:block" />
                        Explore our world of wonders.
                    </p>
                    <Link href="/" className="w-full md:w-auto">
                        <button className="w-full md:w-auto px-10 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-coral-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95">
                            Start Shopping
                        </button>
                    </Link>
                </GlassCard>

                {/* Worlds Navigation */}
                <div className="mt-12 md:mt-16 w-full max-w-5xl relative z-10">
                    <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Or Jump Straight Into</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 justify-items-center">
                        {WORLDS.map((world) => (
                            <Link key={world.name} href={world.href} className="group flex flex-col items-center gap-3 w-full">
                                <div
                                    className="w-full aspect-[3/4] rounded-2xl relative overflow-hidden bg-white shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1 border border-white/50"
                                >
                                    {world.image ? (
                                        <Image src={world.image} alt={world.name} fill sizes="(max-width: 768px) 50vw, 150px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-4xl" style={{ backgroundColor: world.color }}>{world.icon}</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-[10px] md:text-xs font-bold text-navy-800 uppercase tracking-wide group-hover:text-coral-500 transition-colors">
                                        {world.name}
                                    </span>
                                    <span className="text-[9px] text-gray-400 font-medium mt-0.5 group-hover:text-gray-600 transition-colors">
                                        {world.subtitle}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background relative overflow-hidden pb-32 md:pb-20 pt-[var(--header-height)]">
            {/* Background Decor */}
            <AmbientBackground className="opacity-60" />

            <div className="container-premium max-w-[1200px] mx-auto px-4 md:px-6 pt-8 md:pt-12 relative z-10">
                <header className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-2">My Bag 🛍️</h1>
                    <p className="text-secondary font-medium">{items.reduce((acc, i) => acc + i.qty, 0)} items ready for adventure</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Items Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <GlassCard key={item.id} className="p-4 md:p-6 flex gap-4 md:gap-6 items-center group hover:border-coral-500/30 transition-colors">
                                {/* Image */}
                                <div className="w-24 h-24 md:w-32 h-32 bg-surface-2 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 relative">
                                    <Image src={getGoogleDriveDirectLink(item.image)} alt={item.name} fill sizes="128px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg md:text-xl font-bold text-primary leading-tight truncate pr-4">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-secondary hover:text-red-500 transition-colors bg-surface-2 p-2 rounded-full hover:bg-red-500/10"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <p className="text-sm font-bold text-secondary mb-3">
                                        {item.size && <span>{item.size} • </span>}
                                        {item.color && <span>{item.color}</span>}
                                    </p>

                                    <div className="flex justify-between items-end">
                                        <span className="text-xl font-bold text-primary">{formatPrice(item.price)}</span>

                                        {/* Quantity */}
                                        <div className="flex items-center gap-3 bg-surface-2 rounded-xl shadow-sm border border-subtle px-1 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.qty - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-3 rounded-lg transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-4 text-center text-sm font-bold text-primary">{item.qty}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.qty + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-3 rounded-lg transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}

                        {/* Gift Note / Upsell (Optional Adorable Touch) */}

                    </div>

                    {/* Summary Column */}
                    <div className="lg:col-span-1 lg:sticky lg:top-32">
                        <GlassCard className="p-6 md:p-8 bg-card backdrop-blur-xl border border-subtle">
                            <h2 className="text-2xl font-heading font-bold text-primary mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm font-medium text-secondary">
                                    <span>Subtotal</span>
                                    <span className="text-primary font-bold">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-secondary">
                                    <span>Shipping</span>
                                    <span className={`${shipping === 0 ? 'text-green-500' : 'text-primary'} font-bold`}>
                                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-secondary">
                                    <span>Tax</span>
                                    <span className="text-primary font-bold">{formatPrice(tax)}</span>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-subtle my-6"></div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-lg font-bold text-primary">Total</span>
                                <span className="text-3xl font-heading font-bold text-primary">{formatPrice(total)}</span>
                            </div>

                            <Link href="/checkout" className="block w-full">
                                <button className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-coral-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group">
                                    Checkout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-secondary font-medium">
                                <ShieldCheck size={14} /> Secure Checkout
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout (Optional overlap handling) */}
            <div className="fixed bottom-0 inset-x-0 p-4 bg-card/90 backdrop-blur-md border-t border-subtle md:hidden z-50">
                <Link href="/checkout">
                    <button className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                        Checkout • {formatPrice(total)}
                    </button>
                </Link>
            </div>
        </main>
    );
};

export default CartPage;
