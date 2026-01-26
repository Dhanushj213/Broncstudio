'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BrandLoaderProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function BrandLoader({ text = 'Loading', size = 'md' }: BrandLoaderProps) {
    // Size mapping
    const dimensions = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };

    // Border width mapping
    const borders = {
        sm: 'border-2',
        md: 'border-4',
        lg: 'border-[5px]'
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className={`relative ${dimensions[size]}`}>
                {/* Outer Ring - Navy */}
                <motion.span
                    className={`absolute inset-0 ${borders[size]} border-navy-900/20 border-t-navy-900 rounded-full`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Ring - Coral */}
                <motion.span
                    className={`absolute inset-0 m-auto w-[65%] h-[65%] ${borders[size]} border-coral-500/20 border-b-coral-500 rounded-full`}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Dot (Optional pulsing core) */}
                <motion.div
                    className="absolute inset-0 m-auto w-[20%] h-[20%] bg-navy-900 rounded-full"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Pulsing Text */}
            {text && (
                <motion.p
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                    className="mt-6 text-xs font-bold tracking-[0.3em] text-navy-900 uppercase font-heading"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
}
