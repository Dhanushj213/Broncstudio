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

import { ArrowRight, Box, Shirt, Heart, Home as HomeIcon, Smartphone, Watch, Dog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    { name: 'Stationary & Toys', icon: Box, link: '/shop/stationary-toys' },
    { name: 'Clothing', icon: Shirt, link: '/shop/clothing' },
    { name: 'Lifestyle', icon: Heart, link: '/shop/lifestyle' },
    { name: 'Home & Tech', icon: Smartphone, link: '/shop/home-tech' },
    { name: 'Accessories', icon: Watch, link: '/shop/accessories' },
    { name: 'Pets', icon: Dog, link: '/shop/pets' },
];

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
    const [isHovered, setIsHovered] = useState(false);

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
                        poster={processedContent.poster_url || '/images/placeholder.jpg'}
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
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-48 px-6 text-center z-10">
                    <div className="animate-fade-in-up relative">
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

                        {/* Interactive Button Section */}
                        <div
                            className="relative flex items-center justify-center"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {/* Category Pop-out Buttons */}
                            <AnimatePresence>
                                {isHovered && !isMobile && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-12 flex items-center justify-center gap-4 pointer-events-none">
                                        {CATEGORIES.map((cat, idx) => (
                                            <motion.div
                                                key={cat.name}
                                                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                    transition: {
                                                        type: 'spring',
                                                        stiffness: 300,
                                                        damping: 25,
                                                        delay: idx * 0.05
                                                    }
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: -10,
                                                    scale: 0.9,
                                                    transition: { duration: 0.2 }
                                                }}
                                                className="pointer-events-auto"
                                            >
                                                <Link
                                                    href={cat.link}
                                                    className="group/cat flex flex-col items-center justify-center w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:border-white/30 shadow-2xl"
                                                >
                                                    <cat.icon className="w-6 h-6 text-white mb-2 transition-transform group-hover/cat:scale-110" />
                                                    <span className="text-[10px] text-white font-medium uppercase tracking-tighter text-center leading-tight">
                                                        {cat.name}
                                                    </span>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Main Shop Now Button */}
                            {content.button_text && (
                                <Link
                                    href={content.button_link || '#'}
                                    className="group/btn relative z-20 inline-flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-[18px] text-sm font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.5)] overflow-hidden"
                                >
                                    <span className="relative z-10">{content.button_text}</span>
                                    <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-2" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

