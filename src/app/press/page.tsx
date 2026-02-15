'use client';

import React, { useEffect, useState } from 'react';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { createBrowserClient } from '@supabase/ssr';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

const FEATURES_DEFAULTS: { name: string; logo: string; quote: string; date: string }[] = [];

export default function PressPage() {
    const [features, setFeatures] = useState(FEATURES_DEFAULTS);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchPress = async () => {
            const { data } = await supabase
                .from('content_blocks')
                .select('content')
                .eq('section_id', 'press_content')
                .single();
            if (data && data.content) {
                setFeatures(data.content);
            }
        };
        fetchPress();
    }, []);

    return (
        <div className="min-h-screen bg-[#FAF9F7] dark:bg-black pb-20 pt-[var(--header-height)]">
            <AmbientBackground />

            <div className="container-premium max-w-[1000px] mx-auto px-6 py-20 text-center">
                <span className="text-coral-500 font-bold tracking-widest uppercase text-xs mb-4 block">As Seen In</span>
                <h1 className="text-5xl font-heading font-bold text-navy-900 dark:text-white mb-16">
                    Making Headlines.
                </h1>

                <div className="grid gap-12">
                    {features.map((feature, i) => (
                        <div key={i} className="bg-white dark:bg-white/5 p-12 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row items-center gap-12 text-left group">
                            <div className="w-full md:w-1/3 flex items-center justify-center p-6 bg-gray-50 dark:bg-white/10 rounded-2xl h-40">
                                {feature.logo ? (
                                    <img
                                        src={getGoogleDriveDirectLink(feature.logo)}
                                        alt={feature.name}
                                        className="max-h-12 max-w-full opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 dark:invert"
                                    />
                                ) : (
                                    <span className="text-gray-400 font-bold text-xl">{feature.name}</span>
                                )}
                            </div>
                            <div className="w-full md:w-2/3">
                                <blockquote className="text-2xl font-heading font-medium text-navy-900 dark:text-white mb-4 leading-normal">
                                    "{feature.quote}"
                                </blockquote>
                                <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                    {feature.name} • {feature.date}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24">
                    <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-6">Press Inquiries</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">For media kits and interview requests, please contact our PR team.</p>
                    <a href="mailto:press@broncstudio.com" className="bg-navy-900 dark:bg-white text-white dark:text-black font-bold py-3 px-8 rounded-full hover:bg-coral-500 dark:hover:bg-coral-400 transition-colors">
                        press@broncstudio.com
                    </a>
                </div>
            </div>
        </div>
    );
}
