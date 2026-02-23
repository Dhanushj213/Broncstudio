'use client';

import React, { useEffect, useState } from 'react';
import InfoPage from '@/components/Layout/InfoPage';
import { Ruler, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';
import Image from 'next/image';

interface SizeChart {
    id: string;
    label: string;
    image_url: string;
}

export default function SizeGuidePage() {
    const [charts, setCharts] = useState<SizeChart[]>([]);
    const [activeChartId, setActiveChartId] = useState<string | null>(null);
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

                if (data?.content?.charts) {
                    const fetchedCharts = data.content.charts;
                    setCharts(fetchedCharts);
                    if (fetchedCharts.length > 0) {
                        setActiveChartId(fetchedCharts[0].id);
                    }
                }
            } catch (err) {
                console.error('Error fetching size guide:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSizeGuide();
    }, []);

    const activeChart = charts.find(c => c.id === activeChartId);

    return (
        <InfoPage title="Size Guide">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Precision sizing for growing silhouettes. <br className="hidden md:block" />
                        Crafted to support every step of their development.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                        <Loader2 className="animate-spin text-navy-900 dark:text-white mb-4" size={32} />
                        <p className="text-gray-400 font-medium">Fetching Size Specifications...</p>
                    </div>
                ) : charts.length > 0 ? (
                    <div className="space-y-8">
                        {/* Tabs Navigation */}
                        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-2xl w-fit mx-auto border border-gray-100 dark:border-white/10">
                            {charts.map((chart) => (
                                <button
                                    key={chart.id}
                                    onClick={() => setActiveChartId(chart.id)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative ${activeChartId === chart.id
                                        ? 'text-navy-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-navy-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {activeChartId === chart.id && (
                                        <motion.div
                                            layoutId="activeSizeTab"
                                            className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-sm"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{chart.label || 'Unnamed Chart'}</span>
                                </button>
                            ))}
                        </div>

                        {/* Chart Display */}
                        <AnimatePresence mode="wait">
                            {activeChart && (
                                <motion.div
                                    key={activeChart.id}
                                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.02, y: -10 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl relative"
                                >
                                    <div className="relative w-full min-h-[500px] md:min-h-[700px]">
                                        <Image
                                            src={getGoogleDriveDirectLink(activeChart.image_url)}
                                            alt={activeChart.label || "Size Guide Chart"}
                                            fill
                                            className="object-contain p-4 md:p-8"
                                            sizes="(max-width: 768px) 100vw, 1200px"
                                            priority
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
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
