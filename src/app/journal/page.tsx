'use client';

import React from 'react';
import Link from 'next/link';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';

const ARTICLES = [
    {
        slug: '5-books-every-little-legend-should-read',
        title: '5 Books Every Little Legend Should Read',
        excerpt: 'From magical forests to space adventures, these stories will spark your child’s imagination like never before.',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop',
        category: 'Education',
        date: 'Jan 24, 2024',
        readTime: '5 min read'
    },
    {
        slug: 'style-guide-dressing-for-play',
        title: 'Style Guide: Dressing for Play',
        excerpt: 'Comfort meets cool. How to choose outfits that survive the playground test while looking picture-perfect.',
        image: 'https://images.unsplash.com/photo-1502781252888-9143ba7f074e?q=80&w=1000&auto=format&fit=crop',
        category: 'Fashion',
        date: 'Jan 18, 2024',
        readTime: '4 min read'
    },
    {
        slug: 'behind-the-scenes',
        title: 'Behind the Scenes of Our New Collection',
        excerpt: 'Take a peek into our design studio and see how our latest "Space Stories" collection came to life.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
        category: 'Inside Broncstudio',
        date: 'Jan 10, 2024',
        readTime: '6 min read'
    }
];

export default function JournalPage() {
    const featured = ARTICLES[0];
    const recent = ARTICLES.slice(1);

    return (
        <div className="min-h-screen bg-[#FAF9F7] pb-20 pt-[var(--header-height)]">
            <AmbientBackground />

            <div className="container-premium max-w-[1200px] mx-auto px-6 py-12">
                <div className="text-center mb-16">
                    <span className="text-coral-500 font-bold tracking-widest uppercase text-xs mb-4 block">The Bronc Journal</span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy-900">
                        Stories & Ideas
                    </h1>
                </div>

                {/* Featured Article */}
                <Link href={`/journal/${featured.slug}`} className="group block mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-200 relative shadow-md group-hover:shadow-xl transition-all duration-500">
                            <img
                                src={featured.image}
                                alt={featured.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-black uppercase tracking-wider">
                                {featured.category}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                <span>{featured.date}</span>
                                <span>•</span>
                                <span>{featured.readTime}</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-900 group-hover:text-coral-500 transition-colors">
                                {featured.title}
                            </h2>
                            <p className="text-gray-500 text-lg leading-relaxed">
                                {featured.excerpt}
                            </p>
                            <span className="inline-flex items-center gap-2 text-navy-900 font-bold underline decoration-2 decoration-coral-500/30 group-hover:decoration-coral-500 transition-all">
                                Read Story <ArrowRight size={18} />
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Recent Grid */}
                <h3 className="text-2xl font-bold text-navy-900 mb-8 pt-8 border-t border-gray-100">Latest Reads</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recent.map((article, i) => (
                        <Link key={i} href={`/journal/${article.slug}`} className="group block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100">
                            <div className="aspect-[3/2] rounded-xl overflow-hidden bg-gray-200 mb-4">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                                    <span className="text-coral-500 font-bold uppercase">{article.category}</span>
                                    <span>{article.readTime}</span>
                                </div>
                                <h4 className="text-xl font-heading font-bold text-navy-900 group-hover:text-coral-500 transition-colors leading-tight">
                                    {article.title}
                                </h4>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {article.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}

                    {/* Placeholder for "Coming Soon" or more layout balance */}
                    <div className="bg-navy-900 rounded-2xl p-8 flex flex-col justify-center text-center text-white">
                        <h4 className="text-2xl font-heading font-bold mb-2">Join the Club</h4>
                        <p className="text-white/70 text-sm mb-6">Get stories, styling tips, and new product drops sent to your inbox.</p>
                        <form className="flex flex-col gap-2">
                            <input type="email" placeholder="Your email" className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none" />
                            <button className="bg-white text-navy-900 font-bold py-2 rounded-lg text-sm hover:bg-coral-500 hover:text-white transition-colors">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
