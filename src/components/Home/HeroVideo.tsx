'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function HeroVideo() {
    const [content, setContent] = useState({
        video_url: 'https://videos.pexels.com/video-files/5668471/5668471-uhd_2560_1440_30fps.mp4',
        poster_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
        heading: 'Summer Luxe',
        subheading: 'New Collection',
        button_text: 'Shop Now',
        button_link: '/shop/new-arrivals'
    });

    useEffect(() => {
        const fetchContent = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { data } = await supabase
                .from('content_blocks')
                .select('content')
                .eq('section_id', 'hero_main')
                .single();

            if (data && data.content) {
                // Merge with defaults to ensure safety
                setContent(prev => ({ ...prev, ...data.content }));
            }
        };

        fetchContent();
    }, []);

    return (
        <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-black">
            {/* Video Background */}
            <video
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                autoPlay
                loop
                muted
                playsInline
                poster={content.poster_url}
                key={content.video_url} // Force reload on url change
            >
                {content.video_url && <source src={content.video_url} type="video/mp4" />}
                Your browser does not support the video tag.
            </video>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Content Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center z-10">
                <span className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-3 animate-fade-in-up">
                    {content.subheading}
                </span>
                <h2 className="text-white text-4xl md:text-6xl font-serif font-medium italic mb-6 animate-fade-in-up delay-100">
                    {content.heading}
                </h2>
                <Link
                    href={content.button_link}
                    className="bg-white text-navy-900 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg animate-fade-in-up delay-200"
                >
                    {content.button_text}
                </Link>
            </div>
        </section>
    );
}
