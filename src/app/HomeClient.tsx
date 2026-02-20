'use client';

import React, { useEffect, useState } from 'react';
import DepartmentBentoGrid from '@/components/Home/DepartmentBentoGrid';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { Sparkles, Heart, ShieldCheck } from 'lucide-react';
import GlassCard from '@/components/UI/GlassCard';
import ProductShowcase from '@/components/Home/ProductShowcase';
import Link from 'next/link';
import MobileCategoryRail from '@/components/Home/MobileCategoryRail';
import HeroVideo from '@/components/Home/HeroVideo';

import CuratedGrid from '@/components/Home/CuratedGrid';

import MasonryProductGrid from '@/components/Home/MasonryProductGrid';
import LimitedDropSection from '@/components/Home/LimitedDropSection';
import DiscoverMore from '@/components/Home/DiscoverMore';
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
  secondaryImage: p.images?.[1], // Pass 2nd image for hover
  badge: undefined, // Logic can be added later
  metadata: p.metadata,
});

export default function HomeClient() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [dropData, setDropData] = useState<any>(null);
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
      // Fetch New Arrivals (Manual Priority)
      const { data: newProds } = await supabase
        .from('products')
        .select('*')
        .contains('metadata', { is_new_arrival: true })
        .limit(12);

      if (newProds) {
        setNewArrivals(newProds.map((p: any) => ({ ...mapProduct(p), badge: 'New' })));
      }

      // Fetch Featured (Random 25 or just general list)
      // Since we don't have a 'featured' flag, we'll just take 25.
      const { data: featProds } = await supabase
        .from('products')
        .select('*')
        .contains('metadata', { is_featured: true })
        .limit(28);

      if (featProds) {
        setFeaturedProducts(featProds.map(mapProduct));
      }

      // Fetch Limited Drop
      const { data: dropBlock } = await supabase
        .from('content_blocks')
        .select('content')
        .eq('section_id', 'limited_drop')
        .single();

      if (dropBlock && dropBlock.content) {
        setDropData(dropBlock.content);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <AmbientBackground />

      <HeroVideo />

      {/* Department BentoGrid */}
      <div id="worlds" className="relative pt-6 pb-4 text-center scroll-mt-[var(--header-height)]">
        <h1 className="text-3xl font-cursive md:font-sans md:text-sm md:font-bold md:tracking-[0.2em] md:uppercase text-[#891d12] mb-4 animate-fade-in-up">
          Shop By Categories
        </h1>
        <DepartmentBentoGrid />
      </div>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <MasonryProductGrid
          products={newArrivals}
          title="Fresh Drops"
          subtitle="Get them before they're gone."
        />
      )}

      {/* Limited Edition Drop Section */}
      {dropData && dropData.is_enabled && (
        <LimitedDropSection data={dropData} />
      )}

      {/* Featured Collection - Masonry Layout */}
      <MasonryProductGrid products={featuredProducts} />

      {/* Unified Curated Grid (Mobile & Desktop) */}
      <CuratedGrid />

      {/* Discover More / Random Feed */}
      <DiscoverMore />

      {/* Premium Features / Trust Signals */}
      <section className="py-16 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group p-8 rounded-[32px] bg-zinc-100 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] text-center transition-transform duration-500 hover:-translate-y-2 hover:bg-white dark:hover:bg-white/10">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 bg-white dark:bg-white/10 text-blue-600 dark:text-blue-300 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] dark:shadow-inner dark:ring-1 dark:ring-white/20">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 tracking-wide text-navy-900 dark:text-white">Curated Collections</h3>
              <p className="font-medium leading-relaxed text-gray-600 dark:text-gray-200">Handpicked items that tell a story and spark joy.</p>
            </div>
            <div className="relative group p-8 rounded-[32px] bg-zinc-100 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] text-center transition-transform duration-500 hover:-translate-y-2 hover:bg-white dark:hover:bg-white/10">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 bg-white dark:bg-white/10 text-rose-600 dark:text-rose-300 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] dark:shadow-inner dark:ring-1 dark:ring-white/20">
                <Heart size={28} />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 tracking-wide text-navy-900 dark:text-white">Emotionally Crafted</h3>
              <p className="font-medium leading-relaxed text-gray-600 dark:text-gray-200">Designs that connect with your personal style and moments.</p>
            </div>
            <div className="relative group p-8 rounded-[32px] bg-zinc-100 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] text-center transition-transform duration-500 hover:-translate-y-2 hover:bg-white dark:hover:bg-white/10">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-300 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] dark:shadow-inner dark:ring-1 dark:ring-white/20">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 tracking-wide text-navy-900 dark:text-white">Premium Quality</h3>
              <p className="font-medium leading-relaxed text-gray-600 dark:text-gray-200">Materials and finish that feel as good as they look.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
