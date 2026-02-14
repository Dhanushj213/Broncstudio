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
    mobile_images: string[];
    heading: string;
    subheading: string;
    button_text: string;
    button_link: string;
}

import { ArrowRight } from 'lucide-react';

export default function HeroVideo() {
    const [content, setContent] = useState<HeroContent>({
        type: 'video',
        video_url: '',
        poster_url: '',
        images: [],
        mobile_images: [],
        heading: '',
        subheading: '',
        button_text: 'Shop Now',
        button_link: '/shop/new-arrivals'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

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
                    images: data.content.images || prev.images,
                    mobile_images: data.content.mobile_images || data.content.images || prev.mobile_images
                }));
            }
            setIsLoading(false);
        };

        fetchContent();

        // Device detection
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Process content to handle Google Drive links and sanitize fallback text
    const processedContent = React.useMemo(() => {
        const sanitize = (text: string) => {
            if (!text) return '';
            return text
                .replace(/No video configured/gi, '')
                .replace(/No images configured/gi, '')
                .replace(/Summer Luxe/gi, '')
                .replace(/New Collection/gi, '')
                .trim();
        };

        return {
            ...content,
            heading: sanitize(content.heading),
            subheading: sanitize(content.subheading),
            video_url: getGoogleDriveDirectLink(content.video_url),
            poster_url: getGoogleDriveDirectLink(content.poster_url),
            images: content.images.map(img => getGoogleDriveDirectLink(img))
        };
    }, [content]);

    // Filter out empty strings from images based on device
    const validImages = React.useMemo(() => {
        const imageSet = isMobile && content.mobile_images?.length > 0
            ? content.mobile_images
            : content.images;

        return imageSet ? imageSet
            .filter(img => img && img.trim() !== '')
            .map(img => getGoogleDriveDirectLink(img)) : [];
    }, [content.images, content.mobile_images, isMobile]);

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
        <section
            className="relative w-full overflow-hidden bg-black group"
            style={{
                height: isMobile
                    ? 'calc(100vh - 104px - 4rem - env(safe-area-inset-bottom))'
                    : 'calc(100vh - 104px)'
            }}
        >
            {/* Background Content */}
            {content.type === 'video' ? (
                processedContent.video_url ? (
                    <video
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-80"
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
                    <div className="min-w-full w-full h-full bg-black flex items-center justify-center" />
                )
            ) : (
                <div
                    ref={scrollContainerRef}
                    className="absolute inset-0 w-full h-full flex overflow-hidden scroll-smooth"
                >
                    {validImages.map((img, idx) => (
                        <div key={idx} className="min-w-full w-full h-full snap-center flex-shrink-0 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={img}
                                alt={`Banner ${idx + 1}`}
                                className="w-full h-full object-cover object-top opacity-90"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    ))}
                    {/* Fallback if no valid images are found */}
                    {validImages.length === 0 && (
                        <div className="min-w-full w-full h-full bg-black flex items-center justify-center" />
                    )}
                </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

            {/* Content Overlay - Centered/Bottom Biased */}
            {!isLoading && (processedContent.heading || processedContent.subheading || content.button_text) && (
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-32 md:pb-48 px-6 text-center z-10 transition-all">
                    <div className="animate-fade-in-up">
                        {processedContent.subheading && (
                            <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-6 block drop-shadow-md opacity-80">
                                {processedContent.subheading}
                            </span>
                        )}
                        {processedContent.heading && (
                            <h2 className="text-white text-4xl md:text-8xl font-serif font-medium italic mb-12 drop-shadow-2xl leading-[1.1] text-center max-w-4xl mx-auto">
                                {processedContent.heading}
                            </h2>
                        )}
                        {content.button_text && (
                            <Link
                                href={content.button_link || '#'}
                                className="group/btn relative inline-flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden"
                            >
                                <span className="relative z-10">{content.button_text}</span>
                                <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-2" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
