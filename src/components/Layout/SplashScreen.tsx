'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Show for 2 seconds, then exit
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF9F7]/80 backdrop-blur-xl"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
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
                                className="object-contain dark:hidden"
                                priority
                            />
                            <Image
                                src="/whitelogo.png"
                                alt="Broncstudio"
                                fill
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
                                className="relative h-16 md:h-24 w-auto aspect-[4/1]"
                            >
                                <Image
                                    src="/broncname.png"
                                    alt="Broncstudio"
                                    fill
                                    className="object-contain dark:hidden"
                                    priority
                                />
                                <Image
                                    src="/broncnamey.png"
                                    alt="Broncstudio"
                                    fill
                                    className="object-contain hidden dark:block"
                                    priority
                                />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
