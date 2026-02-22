'use client';

import React, { useEffect, useState } from 'react';
import InfoPage from '@/components/Layout/InfoPage';
import { Ruler, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';
import Image from 'next/image';

export default function SizeGuidePage() {
    const [sizeGuide, setSizeGuide] = useState<{ image_url: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchSizeGuide = async () => {
            try {
                const { data } = await supabase
                    .from('content_blocks')
                    .select('content')
                    .eq('section_id', 'global_size_guide')
                    .single();

                if (data?.content) {
                    setSizeGuide(data.content);
                }
            } catch (err) {
                console.error('Error fetching size guide:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSizeGuide();
    }, []);

    return (
        <InfoPage title="Size Guide">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Find the perfect fit for your little one. <br className="hidden md:block" />
                        Our guide helps you choose the right silhouette for every growth milestone.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                        <Loader2 className="animate-spin text-navy-900 dark:text-white mb-4" size={32} />
                        <p className="text-gray-400 font-medium">Fetching Size Specifications...</p>
                    </div>
                ) : sizeGuide?.image_url ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl relative"
                    >
                        <div className="relative w-full min-h-[500px] md:min-h-[700px]">
                            <Image
                                src={getGoogleDriveDirectLink(sizeGuide.image_url)}
                                alt="Size Guide Chart"
                                fill
                                className="object-contain p-4 md:p-8"
                                sizes="(max-width: 768px) 100vw, 1200px"
                                priority
                            />
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 mb-6">
                            <Ruler size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">Specifications Coming Soon</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">We are currently updating our size charts. Please check back shortly or contact support for sizing help.</p>
                    </div>
                )}
            </div>
        </InfoPage>
    );
}
