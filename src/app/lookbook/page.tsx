'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { Instagram, ShoppingBag, ImageIcon } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

export default function LookbookPage() {
    const [looks, setLooks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchLooks = async () => {
            const { data } = await supabase
                .from('content_blocks')
                .select('content')
                .eq('section_id', 'lookbook_content')
                .single();
            if (data && data.content && Array.isArray(data.content) && data.content.length > 0) {
                setLooks(data.content);
            }
            setIsLoading(false);
        };
        fetchLooks();
    }, []);

    return (
        <div className="min-h-screen bg-background pt-[var(--header-height)] pb-20">
            <AmbientBackground />

            <div className="container-premium max-w-[1200px] mx-auto px-6 py-12">
                <div className="text-center mb-16">
                    <span className="text-coral-500 font-bold tracking-widest uppercase text-xs mb-4 block">#SpottedInBronc</span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
                        Real Kids. Real Style.
                    </h1>
                    <p className="text-secondary max-w-xl mx-auto">
                        Tag us using <strong>#Broncstudio</strong> to be featured in our gallery of legends.
                    </p>
                    <a href="#" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-card border border-subtle rounded-full text-primary font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shadow-sm">
                        <Instagram size={18} /> Follow @broncstudio
                    </a>
                </div>

                {/* Empty State vs Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : looks.length === 0 ? (
                    <div className="text-center py-20 bg-surface-2 rounded-3xl border border-subtle">
                        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="text-muted-foreground w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">Gallery Coming Soon</h3>
                        <p className="text-secondary">Be the first to be featured! Tag us in your photos.</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-3 lg:columns-4 gap-6 space-y-6">
                        {looks.map(look => (
                            <div key={look.id} className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-surface-2">
                                {look.image ? (
                                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                                        <Image
                                            src={look.image.startsWith('http') ? getGoogleDriveDirectLink(look.image) : look.image}
                                            alt={`Look by ${look.user}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-64 bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                                        <ShoppingBag className="text-gray-400" />
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                                    <div className="text-white text-xs font-bold uppercase tracking-widest text-right">
                                        Featured
                                    </div>
                                    <div>
                                        <div className="text-white font-bold mb-3">{look.user}</div>
                                        <button className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-coral-500 hover:text-white transition-colors w-fit">
                                            <ShoppingBag size={14} /> Shop Look
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
