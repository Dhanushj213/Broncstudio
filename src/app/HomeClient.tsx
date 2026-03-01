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
import SpecialCollectionsRail from '@/components/Home/SpecialCollectionsRail';

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
  images: p.images || [], // Pass full images array
  badge: undefined,
  metadata: p.metadata,
});

interface HomeClientProps {
  initialNewArrivals?: any[];
  initialFeaturedProducts?: any[];
  initialDropData?: any;
  initialHeroContent?: any;
  initialSpecialCollections?: any[];
  initialCuratedSections?: any[];
  initialBentoData?: any[];
}

export default function HomeClient({
  initialNewArrivals,
  initialFeaturedProducts,
  initialDropData,
  initialHeroContent,
  initialSpecialCollections,
  initialCuratedSections,
  initialBentoData
}: HomeClientProps) {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>(initialFeaturedProducts || []);
  const [newArrivals, setNewArrivals] = useState<any[]>(initialNewArrivals || []);
  const [dropData, setDropData] = useState<any>(initialDropData || null);
  const [loading, setLoading] = useState({
    newArrivals: !initialNewArrivals,
    featured: !initialFeaturedProducts,
    drop: !initialDropData
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({
    newArrivals: false,
    featured: false,
    drop: false
  });

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
    async function fetchNewArrivals() {
      if (initialNewArrivals && newArrivals.length > 0) {
        setLoading(prev => ({ ...prev, newArrivals: false }));
        return;
      }
      try {
        const fetchPromise = supabase
          .from('products')
          .select('*')
          .contains('metadata', { is_new_arrival: true })
          .limit(12);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Fetch timeout')), 60000)
        );

        const { data: newProds, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (error) throw error;
        if (newProds) {
          setNewArrivals(newProds.map((p: any) => ({ ...mapProduct(p), badge: 'New' })));
        }
      } catch (err: any) {
        console.group('HomeClient: New Arrivals Fetch Error');
        console.error('Error Object:', err);
        console.error('Error Message:', err.message || 'No message');
        console.error('Error Code:', err.code || 'No code');
        console.groupEnd();
        setErrors(prev => ({ ...prev, newArrivals: true }));
      } finally {
        setLoading(prev => ({ ...prev, newArrivals: false }));
      }
    }

    async function fetchFeatured() {
      if (initialFeaturedProducts && featuredProducts.length > 0) {
        setLoading(prev => ({ ...prev, featured: false }));
        return;
      }
      try {
        const fetchPromise = supabase
          .from('products')
          .select('*')
          .contains('metadata', { is_featured: true })
          .limit(28);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Fetch timeout')), 60000)
        );

        const { data: featProds, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (error) throw error;
        if (featProds) {
          setFeaturedProducts(featProds.map(mapProduct));
        }
      } catch (err: any) {
        console.group('HomeClient: Featured Products Fetch Error');
        console.error('Error Object:', err);
        console.error('Error Message:', err.message || 'No message');
        console.error('Error Code:', err.code || 'No code');
        console.groupEnd();
        setErrors(prev => ({ ...prev, featured: true }));
      } finally {
        setLoading(prev => ({ ...prev, featured: false }));
      }
    }

    async function fetchDropData() {
      if (initialDropData) {
        setLoading(prev => ({ ...prev, drop: false }));
        return;
      }
      try {
        const fetchPromise = supabase
          .from('content_blocks')
          .select('content')
          .eq('section_id', 'limited_drop')
          .single();

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Fetch timeout')), 60000)
        );

        const { data: dropBlock, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found" which is fine
        if (dropBlock && dropBlock.content) {
          setDropData(dropBlock.content);
        }
      } catch (err: any) {
        console.group('HomeClient: Drop Data Fetch Error');
        console.error('Error Object:', err);
        console.error('Error Message:', err.message || 'No message');
        console.error('Error Code:', err.code || 'No code');
        console.groupEnd();
        setErrors(prev => ({ ...prev, drop: true }));
      } finally {
        setLoading(prev => ({ ...prev, drop: false }));
      }
    }

    fetchNewArrivals();
    fetchFeatured();
    fetchDropData();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <AmbientBackground />

      <HeroVideo initialData={initialHeroContent} />

      {/* Department BentoGrid */}
      <div id="worlds" className="relative pt-6 pb-4 text-center scroll-mt-[var(--header-height)]">
        <h1 className="text-3xl font-cursive md:font-sans md:text-sm md:font-bold md:tracking-[0.2em] md:uppercase text-[#891d12] mb-4 animate-fade-in-up">
          Shop By Categories
        </h1>
        <DepartmentBentoGrid initialData={initialBentoData} />
      </div>

      {/* Special Collections Edge Rail */}
      <SpecialCollectionsRail initialData={initialSpecialCollections} />

      {/* New Arrivals Section */}
      {(loading.newArrivals || newArrivals.length > 0) && (
        <MasonryProductGrid
          products={newArrivals}
          title="Fresh Drops"
          subtitle="Get them before they're gone."
          loading={loading.newArrivals}
        />
      )}
      {errors.newArrivals && !loading.newArrivals && (
        <div className="text-center py-12">
          <p className="text-gray-500">Could not load fresh drops at this time.</p>
        </div>
      )}

      {/* Limited Edition Drop Section */}
      {dropData && dropData.is_enabled && (
        <LimitedDropSection data={dropData} />
      )}

      {/* Featured Collection - Masonry Layout */}
      {(loading.featured || featuredProducts.length > 0) && (
        <MasonryProductGrid
          products={featuredProducts}
          loading={loading.featured}
        />
      )}
      {errors.featured && !loading.featured && (
        <div className="text-center py-12">
          <p className="text-gray-500">Our featured collection is temporarily unavailable.</p>
        </div>
      )}

      {/* Unified Curated Grid (Mobile & Desktop) */}
      <CuratedGrid initialData={initialCuratedSections} />

      {/* Discover More / Random Feed */}
      <DiscoverMore initialData={[]} />

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
