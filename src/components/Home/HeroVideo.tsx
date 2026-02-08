'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

type HeroContentType = 'video' | 'images';

interface HeroContent {
    type: HeroContentType;
    video_url: string;
    poster_url: string;
    images: string[];
    heading: string;
    subheading: string;
    button_text: string;
    button_link: string;
}

export default function HeroVideo() {
    const [content, setContent] = useState<HeroContent>({
        type: 'video',
        video_url: '',
        poster_url: '',
        images: [],
        heading: 'Summer Luxe',
        subheading: 'New Collection',
        button_text: 'Shop Now',
        button_link: '/shop/new-arrivals'
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null);

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
                setContent(prev => ({
                    ...prev,
                    ...data.content,
                    // Fallbacks for legacy data
                    type: data.content.type || 'video',
                    images: data.content.images || prev.images
                }));
            }
        };

        fetchContent();
    }, []);

    // Process content to handle Google Drive links
    const processedContent = React.useMemo(() => {
        return {
            ...content,
            video_url: getGoogleDriveDirectLink(content.video_url),
            poster_url: getGoogleDriveDirectLink(content.poster_url),
            images: content.images.map(img => getGoogleDriveDirectLink(img))
        };
    }, [content]);

    // Filter out empty strings from images
    const validImages = React.useMemo(() => {
        return processedContent.images ? processedContent.images.filter(img => img && img.trim() !== '') : [];
    }, [processedContent.images]);

    // Auto-scroll logic for images
    useEffect(() => {
        if (content.type !== 'images' || validImages.length === 0) return;

        const interval = setInterval(() => {
            if (scrollContainerRef.current) {
                const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.current;
                const nextScroll = scrollLeft + clientWidth;

                if (nextScroll >= scrollWidth) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollContainerRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
                }
            }
        }, 5000); // Scroll every 5 seconds

        return () => clearInterval(interval);
    }, [content.type, validImages]);

    return (
        <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-black group">
            {/* Background Content */}
            {content.type === 'video' ? (
                processedContent.video_url ? (
                    <video
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={processedContent.poster_url}
                        key={processedContent.video_url} // Force reload on url change
                    >
                        <source src={processedContent.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="min-w-full w-full h-full bg-gray-900 flex items-center justify-center">
                        <span className="text-gray-700">No video configured</span>
                    </div>
                )
            ) : (
                <div
                    ref={scrollContainerRef}
                    className="absolute inset-0 w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
                >
                    {validImages.map((img, idx) => (
                        <div key={idx} className="min-w-full w-full h-full snap-center flex-shrink-0 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={img}
                                alt={`Banner ${idx + 1}`}
                                className="w-full h-full object-cover opacity-90"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    ))}
                    {/* Fallback if no valid images are found */}
                    {validImages.length === 0 && (
                        <div className="min-w-full w-full h-full bg-gray-900 flex items-center justify-center">
                            <span className="text-gray-700">No images configured</span>
                        </div>
                    )}
                </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Content Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center z-10">
                <span className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-3 animate-fade-in-up drop-shadow-md">
                    {content.subheading}
                </span>
                <h2 className="text-white text-4xl md:text-6xl font-serif font-medium italic mb-6 animate-fade-in-up delay-100 drop-shadow-lg">
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
