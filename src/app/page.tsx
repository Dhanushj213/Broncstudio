'use client';

import React from 'react';
import BentoGridWorld from '@/components/Home/BentoGridWorld';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { Sparkles, Heart, ShieldCheck } from 'lucide-react';
import GlassCard from '@/components/UI/GlassCard';
import ProductShowcase from '@/components/Home/ProductShowcase';
import { getProductImage } from '@/utils/sampleImages';

// Mock Data
const FEATURED_PRODUCTS = Array.from({ length: 25 }).map((_, i) => ({
  id: `feat-${i}`,
  name: `Premium Canvas Sneaker ${i + 1}`,
  brand: 'Little Legends',
  price: 1299 + (i * 100),
  originalPrice: 1999 + (i * 100),
  image: getProductImage(i),
  badge: i < 5 ? 'Bestseller' : undefined,
}));

const NEW_ARRIVALS = Array.from({ length: 8 }).map((_, i) => ({
  id: `new-${i}`,
  name: `Organic Cotton Tee ${i + 1}`,
  brand: 'Everyday Icons',
  price: 799,
  image: getProductImage(i + 5),
  badge: 'New',
}));

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AmbientBackground />

      {/* Spacer for Header */}
      <div className="h-[var(--header-height)]" />

      {/* Hero Section - Bento Grid */}
      <div id="worlds" className="relative pt-6 pb-4 text-center scroll-mt-[var(--header-height)]">
        <h1 className="text-sm font-bold tracking-[0.2em] text-coral-500 uppercase mb-2 animate-fade-in-up">
          Explore Our Worlds
        </h1>
        <BentoGridWorld />
      </div>

      {/* New Arrivals (8 Items) */}
      <ProductShowcase
        title="New Arrivals"
        subtitle="Fresh drops from this week."
        products={NEW_ARRIVALS}
      />

      {/* Featured Products (25 Items) */}
      <ProductShowcase
        title="Featured Collection"
        subtitle="Our most loved pieces, curated just for you."
        products={FEATURED_PRODUCTS}
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
