'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
    // Start visible, then fade out
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // 1. Initial wait
        const timerFunctions = setTimeout(() => {
            setIsVisible(false);
        }, 2200);

        // 2. Remove from DOM after transition (0.8s)
        const cleanupTimer = setTimeout(() => {
            setShouldRender(false);
        }, 3000); // 2200 + 800

        return () => {
            clearTimeout(timerFunctions);
            clearTimeout(cleanupTimer);
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF9F7]/80 backdrop-blur-xl transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            aria-hidden={!isVisible}
        >
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                {/* Logo Animation */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        rotate: 0,
                        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
                    }}
                    className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0 -mr-6 md:-mr-8"
                >
                    <Image
                        src="/blacklogo.png"
                        alt="Broncstudio"
                        fill
                        sizes="(max-width: 768px) 96px, 128px"
                        className="object-contain dark:hidden"
                        priority
                    />
                    <Image
                        src="/whitelogo.png"
                        alt="Broncstudio"
                        fill
                        sizes="(max-width: 768px) 96px, 128px"
                        className="object-contain hidden dark:block"
                        priority
                    />
                </motion.div>

                {/* Text Reveal Animation */}
                <div className="overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: 0.3, duration: 0.8 }
                        }}
                        className="relative h-20 md:h-24 w-auto aspect-[6/1] md:aspect-[4/1]"
                    >
                        <Image
                            src="/broncname.png"
                            alt="Broncstudio"
                            fill
                            sizes="(max-width: 768px) 256px, 384px"
                            className="object-contain hidden md:block dark:hidden"
                            priority
                        />
                        <Image
                            src="/broncnamey.png"
                            alt="Broncstudio"
                            fill
                            sizes="(max-width: 768px) 256px, 384px"
                            className="object-contain hidden dark:md:block"
                            priority
                        />
                        <Image
                            src="/broncstudioredname.png"
                            alt="Broncstudio"
                            fill
                            sizes="(max-width: 768px) 256px, 384px"
                            className="object-contain md:hidden dark:hidden"
                            priority
                        />
                        <Image
                            src="/broncstudioyellowname.png"
                            alt="Broncstudio"
                            fill
                            sizes="(max-width: 768px) 256px, 384px"
                            className="object-contain hidden dark:block dark:md:hidden"
                            priority
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
