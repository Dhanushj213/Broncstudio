'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    Lock, Truck, RotateCcw, MapPin,
    Instagram, Facebook, Youtube, Twitter,
    ChevronDown, CreditCard,
    Crown, Leaf, BookOpen, Newspaper, Percent, Sparkles, HelpCircle
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const FooterAccordion = ({ title, children, isOpenDefault = false }: { title: string, children: React.ReactNode, isOpenDefault?: boolean }) => {
    return (
        <details className="group md:hidden border-b border-white/10 last:border-none" open={isOpenDefault}>
            <summary className="list-none flex justify-between items-center py-4 cursor-pointer text-white font-medium">
                {title}
                <ChevronDown size={16} className="transition-transform group-open:-rotate-180 text-gray-400" />
            </summary>
            <div className="pb-4 text-gray-400 text-sm space-y-2">
                {children}
            </div>
        </details>
    );
};

export default function PremiumFooter() {
    const pathname = usePathname();
    const { addToast } = useToast();
    const [email, setEmail] = React.useState('');
    const [isSubscribing, setIsSubscribing] = React.useState(false);

    if (pathname === '/login') return null;

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubscribing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        addToast('Thank you for subscribing', 'subscribe');
        setEmail('');
        setIsSubscribing(false);
    };

    return (
        <footer className="bg-[#0B1220] text-gray-300 pt-16 pb-24 md:pb-0">
            <div className="container-premium max-w-[1200px] mx-auto">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-12 mb-12 border-b border-white/5">

                    {/* 1. BRAND BLOCK (Left - 4 cols) */}
                    {/* 1. BRAND BLOCK (Left - 4 cols) */}
                    <div className="md:col-span-4 space-y-6">
                        <div>
                            <a href="/" className="flex flex-col items-center gap-2 mb-6 cursor-pointer group w-fit mx-auto md:mx-0">
                                <img src="/whitelogo.png" alt="Broncstudio" className="h-20 w-auto object-contain" />
                                <div className="relative h-10 md:h-14 w-auto aspect-[4/1]">
                                    <Image
                                        src="/broncnamey.png"
                                        alt="Broncstudio"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </a>
                            <p className="text-white/80 italic font-medium">Stories, style, and little things that matter.</p>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            A thoughtfully curated lifestyle brand bringing together kids’ books, fashion, gifts, and everyday essentials — designed to spark joy, trust, and creativity for all ages.
                        </p>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 text-xs text-brand-secondary bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-300 cursor-default">
                                <Lock size={14} className="text-success-mint" /> Secure
                            </div>
                            <div className="flex items-center gap-2 text-xs text-brand-secondary bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-300 cursor-default">
                                <Truck size={14} className="text-success-mint" /> Fast Delivery
                            </div>
                            <div className="flex items-center gap-2 text-xs text-brand-secondary bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-300 cursor-default">
                                <RotateCcw size={14} className="text-success-mint" /> Returns
                            </div>
                            <div className="flex items-center gap-2 text-xs text-brand-secondary bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-300 cursor-default">
                                <MapPin size={14} className="text-success-mint" /> India
                            </div>
                        </div>
                    </div>

                    {/* DESKTOP COLUMNS (8 cols shared by 4 sections = 2 each) */}
                    {/* Mobile: Accordions */}

                    {/* 2. COLLECTIONS */}
                    <div className="md:col-span-2 hidden md:block">
                        <h3 className="text-white font-bold mb-6">Collections</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/shop/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link href="/shop/bestsellers" className="hover:text-white transition-colors">Bestsellers</Link></li>
                            <li className="pt-2 border-t border-white/10 mt-2"></li>
                            <li><Link href="/shop/little-legends" className="hover:text-white transition-colors">Little Legends</Link></li>
                            <li><Link href="/shop/everyday-icons" className="hover:text-white transition-colors">Everyday Icons</Link></li>
                            <li><Link href="/shop/little-luxuries" className="hover:text-white transition-colors">Little Luxuries</Link></li>
                            <li><Link href="/shop/space-stories" className="hover:text-white transition-colors">Space Stories</Link></li>
                            <li><Link href="/shop/pawfect-picks" className="hover:text-white transition-colors">Pawfect Picks</Link></li>
                        </ul>
                    </div>

                    {/* 3. DISCOVER (Premium Features) */}
                    <div className="md:col-span-2 hidden md:block">
                        <h3 className="text-white font-bold mb-6">Discover</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link href="/gift-finder" className="flex items-center gap-2 text-coral-500 hover:text-coral-400 transition-colors font-bold group">
                                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                                    Gift Finder
                                </Link>
                            </li>
                            <li>
                                <Link href="/rewards" className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors font-bold group">
                                    <Crown size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                                    Legends Club
                                </Link>
                            </li>
                            <li>
                                <Link href="/sustainability" className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors font-medium group">
                                    <Leaf size={16} className="group-hover:rotate-45 transition-transform" />
                                    Conscious
                                </Link>
                            </li>
                            <li className="pt-2 border-t border-white/10 mt-2"></li>
                            <li><Link href="/lookbook" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><BookOpen size={14} /> Lookbook</Link></li>
                            <li><Link href="/press" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><Newspaper size={14} /> Press</Link></li>
                            <li><Link href="/shop/sale" className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-bold"><Percent size={14} /> Sale</Link></li>
                        </ul>
                    </div>

                    {/* 4. SUPPORT */}
                    <div className="md:col-span-2 hidden md:block">
                        <h3 className="text-white font-bold mb-6">Support</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/help/track" className="hover:text-white transition-colors">Order Tracking</Link></li>
                            <li><Link href="/help/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
                            <li><Link href="/help/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                            <li><Link href="/help/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
                            <li><Link href="/help/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                            <li><Link href="/help/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li className="pt-4 text-xs font-bold uppercase tracking-wider opacity-50">Policies</li>
                            <li><Link href="/policies/privacy" className="hover:text-white transition-colors text-xs">Privacy Policy</Link></li>
                            <li><Link href="/policies/terms" className="hover:text-white transition-colors text-xs">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* 5. CONNECT (Newsletter) */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-white font-bold mb-2">Get early access</h3>
                            <p className="text-sm text-gray-400 mb-4">Be the first to know about new launches and stories.</p>
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubscribing}
                                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cta-primary focus:ring-1 focus:ring-cta-primary transition-colors w-full disabled:opacity-50"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSubscribing}
                                    className={`bg-red-600 hover:bg-[#800000] text-white font-bold py-3 rounded-lg transition-colors w-full text-sm flex items-center justify-center ${isSubscribing ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {isSubscribing ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Subscribing...
                                        </span>
                                    ) : (
                                        'Subscribe'
                                    )}
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 mt-2 italic">No spam. Only good things.</p>
                        </div>

                        <div className="pt-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Follow the world</h4>
                            <div className="flex gap-4">
                                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 hover:text-white transition-colors"><Instagram size={16} /></a>
                                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 hover:text-white transition-colors"><Facebook size={16} /></a>
                                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 hover:text-white transition-colors"><Youtube size={16} /></a>
                                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 hover:text-white transition-colors"><Twitter size={16} /></a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MOBILE ACCORDIONS (Visible only on mobile) */}
                <div className="md:hidden space-y-0 mb-12">
                    <FooterAccordion title="Explore Our Worlds">
                        <ul className="space-y-3 pb-2 pl-2">
                            <li><Link href="/shop/little-legends" className="block py-1">Little Legends</Link></li>
                            <li><Link href="/shop/everyday-icons" className="block py-1">Everyday Icons</Link></li>
                            <li><Link href="/shop/little-luxuries" className="block py-1">Little Luxuries</Link></li>
                            <li><Link href="/shop/space-stories" className="block py-1">Space Stories</Link></li>
                        </ul>
                    </FooterAccordion>
                    <FooterAccordion title="Quick Shop">
                        <ul className="space-y-3 pb-2 pl-2">
                            <li><Link href="/shop/new-arrivals" className="block py-1">New Arrivals</Link></li>
                            <li><Link href="/shop/bestsellers" className="block py-1">Bestsellers</Link></li>
                        </ul>
                    </FooterAccordion>
                    <FooterAccordion title="Help & Support">
                        <ul className="space-y-3 pb-2 pl-2">
                            <li><Link href="/help/faq" className="block py-1">FAQs</Link></li>
                            <li><Link href="/help/returns" className="block py-1">Returns & Refunds</Link></li>
                            <li><Link href="/help/contact" className="block py-1">Contact Us</Link></li>
                        </ul>
                    </FooterAccordion>
                </div>

                {/* BOTTOM BAR */}
                <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 border-t border-white/5">
                    <div>
                        &copy; {new Date().getFullYear()} Broncstudio. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 group cursor-default">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 group-hover:text-gray-300 transition-colors">MADE IN INDIA</span>
                            <img
                                src="/makeinindia.png"
                                alt="Make in India"
                                className="h-10 w-auto brightness-0 invert opacity-80 group-hover:filter-none group-hover:opacity-100 transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer >
    );
}
