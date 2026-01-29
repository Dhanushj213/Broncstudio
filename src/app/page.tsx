'use client';

import React, { useEffect, useState } from 'react';
import BentoGridWorld from '@/components/Home/BentoGridWorld';
import DesktopCuratedGrid from '@/components/Home/DesktopCuratedGrid';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { Sparkles, Heart, ShieldCheck } from 'lucide-react';
import GlassCard from '@/components/UI/GlassCard';
import ProductShowcase from '@/components/Home/ProductShowcase';
import Link from 'next/link';
import MobileCategoryRail from '@/components/Home/MobileCategoryRail';
import MobileCategoriesGrid from '@/components/Home/MobileCategoriesGrid';
import MobileCuratedGrid from '@/components/Home/MobileCuratedGrid';
import MobilePillsRail from '@/components/Home/MobilePillsRail';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/context/ToastContext';

// Mapped helper
const mapProduct = (p: any) => ({
  id: p.id,
  name: p.name,
  brand: 'BroncStudio',
  price: p.price,
  originalPrice: p.compare_at_price,
  image: p.images?.[0] || '/images/placeholder.jpg',
  badge: undefined, // Logic can be added later
});

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const supabase = createClient();
  const { addToast } = useToast();

  useEffect(() => {
    const checkLoginSuccess = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') === 'success') {
        setTimeout(() => {
          addToast('Welcome back! Login successful.', 'success');
        }, 500); // Small delay to ensure Toast provider is ready
        window.history.replaceState({}, '', '/');
      }
    };
    checkLoginSuccess();
  }, [addToast]);

  useEffect(() => {
    async function fetchData() {
      // Fetch New Arrivals (Manual Priority + Date)
      const { data: manualNew } = await supabase
        .from('products')
        .select('*')
        .contains('metadata', { tags: ['new-arrival'] })
        .limit(4);

      const { data: autoNew } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      const mergedNew = [...(manualNew || []), ...(autoNew || [])];
      const uniqueNew = Array.from(new Map(mergedNew.map(p => [p.id, p])).values()).slice(0, 8);

      setNewArrivals(uniqueNew.map((p: any) => ({ ...mapProduct(p), badge: 'New' })));

      // Fetch Featured (Random 25 or just general list)
      // Since we don't have a 'featured' flag, we'll just take 25.
      const { data: featProds } = await supabase
        .from('products')
        .select('*')
        .limit(28);

      if (featProds) {
        setFeaturedProducts(featProds.map(mapProduct));
      }
    }
    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AmbientBackground />

      {/* Spacer for Header */}
      {/* Spacer removed as Header is sticky */}
      <MobileCategoryRail />
      <MobileCategoriesGrid />
      <MobileCuratedGrid />

      {/* Hero Section - Bento Grid */}
      <div id="worlds" className="relative pt-2 pb-4 text-center scroll-mt-[var(--header-height)]">
        <h1 className="text-sm font-bold tracking-[0.2em] text-coral-500 uppercase mb-2 animate-fade-in-up md:block hidden">
          Explore Our Worlds
        </h1>
        <BentoGridWorld />
      </div>

      <MobilePillsRail />

      {/* New Arrivals (8 Items) */}
      <ProductShowcase
        title="New Arrivals"
        subtitle="Fresh drops from this week."
        products={newArrivals}
      />

      <DesktopCuratedGrid />

      {/* Featured Products (25 Items) */}
      <ProductShowcase
        title="Featured Collection"
        subtitle="Our most loved pieces, curated just for you."
        products={featuredProducts}
        className="bg-gray-50/50 dark:bg-white/5" // Subtle separation
      />

      {/* Premium Features / Trust Signals */}
      <section className="py-16 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-8 rounded-2xl text-center" disableTilt>
              <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-heading text-navy-900 dark:text-white mb-2">Curated Collections</h3>
              <p className="text-gray-500 dark:text-gray-400">Handpicked items that tell a story and spark joy.</p>
            </GlassCard>
            <GlassCard className="p-8 rounded-2xl text-center" disableTilt>
              <div className="w-12 h-12 mx-auto bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-heading text-navy-900 dark:text-white mb-2">Emotionally Crafted</h3>
              <p className="text-gray-500 dark:text-gray-400">Designs that connect with your personal style and moments.</p>
            </GlassCard>
            <GlassCard className="p-8 rounded-2xl text-center" disableTilt>
              <div className="w-12 h-12 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-heading text-navy-900 dark:text-white mb-2">Premium Quality</h3>
              <p className="text-gray-500 dark:text-gray-400">Materials and finish that feel as good as they look.</p>
            </GlassCard>
          </div>
        </div>
      </section>
    </main>
  );
}
