'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import AmbientBackground from '@/components/UI/AmbientBackground';
import Link from 'next/link';
import { ArrowLeft, Share2, Clock, Calendar } from 'lucide-react';

export default function ArticlePage() {
    const params = useParams();
    const slug = params?.slug as string;

    // In a real app, fetch data based on slug.
    // Here we hardcode a generic look for demo.
    const title = slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Article Title';

    return (
        <div className="min-h-screen bg-[#FAF9F7] pb-20 pt-[var(--header-height)]">
            <AmbientBackground />

            {/* Header Image */}
            <div className="w-full h-[60vh] relative">
                <img
                    src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2000&auto=format&fit=crop"
                    alt="Cover"
                    className="w-full h-full object-cover fixed top-0 left-0 -z-10" // Parallax effect
                    style={{ height: '60vh' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7] via-[#FAF9F7]/20 to-transparent" />
            </div>

            <div className="container-premium max-w-[800px] mx-auto px-6 -mt-32 relative z-10">
                <Link href="/journal" className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full mb-8 hover:bg-white transition-colors">
                    <ArrowLeft size={16} /> Back to Journal
                </Link>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-6">
                        <span className="flex items-center gap-2"><Calendar size={16} /> Jan 24, 2024</span>
                        <span className="flex items-center gap-2"><Clock size={16} /> 5 min read</span>
                        <span className="text-coral-500 font-bold uppercase tracking-wider ml-auto">Education</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-navy-900 mb-8 leading-tight">
                        {title}
                    </h1>

                    <div className="prose prose-lg prose-navy max-w-none">
                        <p className="lead">
                            This is the story of how {title} became a topic worth exploring. Reading to children isn't just about the words on the page; it's about the worlds you build together.
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <h3>Why It Matters</h3>
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <figure>
                            <img src="https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1000&auto=format&fit=crop" alt="Reading time" className="rounded-xl w-full" />
                            <figcaption className="text-center text-sm text-gray-400 mt-2 italic">Building memories, one page at a time.</figcaption>
                        </figure>
                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        </p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm font-bold text-navy-900">Share this story:</div>
                        <div className="flex gap-4">
                            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-white transition-colors"><Share2 size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
