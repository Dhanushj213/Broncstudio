'use client';

import React, { useEffect, useState } from 'react';
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
                    <div className="flex items-center gap-4">
                        {/* Logo Animation */}
                        <motion.img
                            src="/BroncStudio (2).png"
                            alt="Broncstudio"
                            className="h-24 w-auto object-contain"
                            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                rotate: 0,
                                transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
                            }}
                        />

                        {/* Text Reveal Animation */}
                        <div className="overflow-hidden">
                            <motion.h1
                                className="font-heading text-6xl font-bold text-navy-900 tracking-tight"
                                initial={{ y: 100, opacity: 0 }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                    transition: { duration: 1, delay: 0.3, ease: "easeOut" }
                                }}
                            >
                                Broncstudio.
                            </motion.h1>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
