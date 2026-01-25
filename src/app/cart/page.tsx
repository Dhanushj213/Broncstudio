'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import GlassCard from '@/components/UI/GlassCard';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { useCart } from '@/context/CartContext';

const CartPage = () => {
    const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

    const shipping = 0; // Free
    const tax = Math.round(cartTotal * 0.05); // 5% Tax
    const total = cartTotal + shipping + tax;

    if (items.length === 0) {
        const WORLDS = [
            { name: 'Little Legends', href: '/shop/little-legends', icon: '🧸', color: '#FFD966', image: 'https://images.unsplash.com/photo-1519457431-44d59405d6e6?auto=format&fit=crop&w=400&q=80' },
            { name: 'Everyday Icons', href: '/shop/everyday-icons', icon: '🧢', color: '#5BC0EB', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80' },
            { name: 'Little Luxuries', href: '/shop/little-luxuries', icon: '✨', color: '#B392AC', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=80' },
            { name: 'Space Stories', href: '/shop/space-stories', icon: '🚀', color: '#1B263B', image: 'https://images.unsplash.com/photo-1532339142463-fd0a8d79797a?auto=format&fit=crop&w=400&q=80' },
            { name: 'Style Extras', href: '/shop/style-extras', icon: '🎒', color: '#9BC53D', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80' },
            { name: 'Sale', href: '/shop/sale', icon: '🏷️', color: '#FF6B6B', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=400&q=80' },
        ];

        return (
            <div className="w-full min-h-[calc(100vh-72px)] bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
                <AmbientBackground className="opacity-60" />

                {/* Empty State Card */}
                <GlassCard className="mx-auto p-8 md:p-12 text-center max-w-md w-full flex flex-col items-center shadow-xl shadow-navy-900/5 relative z-10">
                    <div className="text-6xl mb-6 animate-bounce">🛍️</div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy-900 mb-3 leading-tight">Your Bag is Empty</h2>
                    <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                        Looks like you haven't discovered our treasures yet!
                        <br className="hidden md:block" />
                        Explore our world of wonders.
                    </p>
                    <Link href="/" className="w-full md:w-auto">
                        <button className="w-full md:w-auto px-10 py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-coral-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95">
                            Start Shopping
                        </button>
                    </Link>
                </GlassCard>

                {/* Worlds Navigation */}
                <div className="mt-12 md:mt-16 w-full max-w-4xl relative z-10">
                    <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Or Jump Straight Into</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 justify-items-center">
                        {WORLDS.map((world) => (
                            <Link key={world.name} href={world.href} className="group flex flex-col items-center gap-3">
                                <div
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full relative overflow-hidden bg-white shadow-sm flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:-translate-y-1 border-2 border-white"
                                >
                                    <img src={world.image} alt={world.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <span className="relative z-10 group-hover:animate-shake drop-shadow-md">{world.icon}</span>
                                </div>
                                <span className="text-[10px] md:text-xs font-bold text-navy-800 text-center uppercase tracking-wide group-hover:text-coral-500 transition-colors">
                                    {world.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 relative overflow-hidden pb-32 md:pb-20">
            {/* Background Decor */}
            <AmbientBackground className="opacity-60" />

            <div className="container-premium max-w-[1200px] mx-auto px-4 md:px-6 pt-8 md:pt-12 relative z-10">
                <header className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-navy-900 mb-2">My Bag 🛍️</h1>
                    <p className="text-gray-500 font-medium">{items.reduce((acc, i) => acc + i.qty, 0)} items ready for adventure</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Items Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <GlassCard key={item.id} className="p-4 md:p-6 flex gap-4 md:gap-6 items-center group hover:border-coral-200 transition-colors">
                                {/* Image */}
                                <div className="w-24 h-24 md:w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 relative">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg md:text-xl font-bold text-navy-900 leading-tight truncate pr-4">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors bg-white/50 p-2 rounded-full hover:bg-red-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <p className="text-sm font-bold text-gray-500 mb-3">
                                        {item.size && <span>{item.size} • </span>}
                                        {item.color && <span>{item.color}</span>}
                                    </p>

                                    <div className="flex justify-between items-end">
                                        <span className="text-xl font-bold text-navy-900">₹{item.price}</span>

                                        {/* Quantity */}
                                        <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-100 px-1 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.qty - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-navy-900 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-4 text-center text-sm font-bold">{item.qty}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.qty + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-navy-900 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}

                        {/* Gift Note / Upsell (Optional Adorable Touch) */}
                        <div className="bg-yellow-50/50 rounded-2xl p-4 border border-yellow-100 flex items-center gap-4">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">🎁</div>
                            <div>
                                <h4 className="font-bold text-navy-900 text-sm">Review your order</h4>
                                <p className="text-xs text-gray-500">Every order comes with a free sticker pack!</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Column */}
                    <div className="lg:col-span-1 lg:sticky lg:top-32">
                        <GlassCard className="p-6 md:p-8 bg-white/80 backdrop-blur-xl">
                            <h2 className="text-2xl font-heading font-bold text-navy-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm font-medium text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-navy-900 font-bold">₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-bold">Free</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-gray-500">
                                    <span>Tax</span>
                                    <span className="text-navy-900 font-bold">₹{tax}</span>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-gray-200 my-6"></div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-lg font-bold text-navy-900">Total</span>
                                <span className="text-3xl font-heading font-bold text-navy-900">₹{total}</span>
                            </div>

                            <Link href="/checkout" className="block w-full">
                                <button className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-coral-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group">
                                    Checkout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                                <ShieldCheck size={14} /> Secure Checkout
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout (Optional overlap handling) */}
            <div className="fixed bottom-0 inset-x-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 md:hidden z-50">
                <Link href="/checkout">
                    <button className="w-full py-3.5 bg-navy-900 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                        Checkout • ₹{total}
                    </button>
                </Link>
            </div>
        </main>
    );
};

export default CartPage;
