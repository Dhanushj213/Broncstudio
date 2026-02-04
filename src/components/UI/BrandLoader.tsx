'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface BrandLoaderProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

const ICONS = [
    { id: 'tshirt', color: 'text-coral-500', d: "M20 20 L30 15 L40 20 L40 40 L60 40 L60 20 L70 15 L80 20 L85 35 L75 40 L75 80 L25 80 L25 40 L15 35 Z" },
    { id: 'mug', color: 'text-blue-500', d: "M25 25 L75 25 L70 80 L30 80 Z M75 35 C85 35, 85 60, 72 60" },
    { id: 'cap', color: 'text-green-500', d: "M20 50 C20 30, 80 30, 80 50 L90 55 L90 60 L10 60 L10 55 Z" },
    { id: 'bag', color: 'text-yellow-500', d: "M35 30 L35 15 C35 5, 65 5, 65 15 L65 30 L80 30 L80 85 L20 85 L20 30 Z" },
    { id: 'phone', color: 'text-purple-500', d: "M35 15 L65 15 C70 15, 70 15, 70 20 L70 80 C70 85, 70 85, 65 85 L35 85 C30 85, 30 85, 30 80 L30 20 Z" },
    { id: 'hoodie', color: 'text-pink-500', d: "M30 30 C30 10, 70 10, 70 30 L85 40 L80 85 L20 85 L15 40 Z" }
];

export default function BrandLoader({ text = 'Just a moment...', size = 'md' }: BrandLoaderProps) {
    if (size === 'sm') return <div className="animate-spin w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full" />;

    const radius = 65;

    return (
        <div className="flex flex-col items-center justify-center p-8 w-full min-h-[400px]">
            {/* Center Logo/Pulse */}
            <div className="relative w-56 h-56 flex items-center justify-center">

                {/* Rotating Ring Container */}
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                >
                    {ICONS.map((icon, i) => {
                        const angle = (i / ICONS.length) * 360;
                        const rad = (angle * Math.PI) / 180;

                        // Rounding to 2 decimals to prevent hydration mismatch
                        const x = Math.round(Math.cos(rad) * radius * 100) / 100;
                        const y = Math.round(Math.sin(rad) * radius * 100) / 100;

                        return (
                            <motion.div
                                key={icon.id}
                                className={`absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 flex items-center justify-center ${icon.color}`}
                                style={{
                                    x,
                                    y,
                                }}
                            >
                                {/* Counter-rotate icon to keep upright */}
                                <motion.svg
                                    viewBox="0 0 100 100"
                                    className="w-full h-full fill-none stroke-current stroke-[3] drop-shadow-sm" // Outline style
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                                >
                                    <path d={icon.d} strokeLinecap="round" strokeLinejoin="round" />
                                </motion.svg>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Static Center Branding with Real Logo */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="w-20 h-20 bg-navy-900 rounded-full flex items-center justify-center shadow-2xl z-20 border-4 border-white dark:border-navy-800 p-3 relative">
                        <img
                            src="/whitelogo.png"
                            alt="Broncstudio"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="relative h-12 md:h-16 w-auto aspect-[4/1] animate-pulse">
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
                    </div>
                </div>
                {/* Decorative Rings */}
                <div className="absolute w-32 h-32 border border-navy-100 dark:border-navy-700 rounded-full" />
                <div className="absolute w-40 h-40 border border-dashed border-coral-200 dark:border-coral-800 rounded-full animate-spin-slow" />
            </div>

            {/* Text */}
            <motion.p
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                className="mt-8 text-xs font-bold tracking-[0.3em] text-navy-900 dark:text-white uppercase bg-clip-text text-transparent bg-gradient-to-r from-navy-900 to-coral-500"
            >
                {text}
            </motion.p>
        </div>
    );
}
