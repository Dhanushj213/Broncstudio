'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface BrandLoaderProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

const LOADER_QUOTES = [
    // Fashion
    "Style is a way to say who you are without having to speak.",
    "Fashion fades, only style remains the same.",
    "Clothes mean nothing until someone lives in them.",
    "Fashion is about dreaming and making other people dream.",

    // Lifestyle
    "The best form of luxury is time.",
    "Live the life you've imagined.",
    "Elegance is not standing out, but being remembered.",
    "Quality is not an act, it is a habit.",

    // Discipline
    "Discipline is the bridge between goals and accomplishment.",
    "Suffer the pain of discipline or suffer the pain of regret.",
    "Motivation gets you going, but discipline keeps you growing.",
    "Discipline is choosing between what you want now and what you want most.",

    // Motivation
    "The best is yet to come.",
    "Chase excellence, and success will follow.",
    "Focus on the process, not the outcome.",
    "Your ambition is the only limit."
];

export default function BrandLoader({ text = 'Just a moment...', size = 'md' }: BrandLoaderProps) {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const randomQuote = LOADER_QUOTES[Math.floor(Math.random() * LOADER_QUOTES.length)];
        setQuote(randomQuote);
    }, []);

    if (size === 'sm') return <div className="animate-spin w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full" />;

    return (
        <div className="flex flex-col items-center justify-center p-8 w-full min-h-[500px] overflow-hidden">
            <div className="relative w-80 h-80 flex items-center justify-center">

                {/* 1. Background Pulse Rings - Advanced Depth */}
                <motion.div
                    className="absolute w-48 h-48 border border-navy-50 dark:border-navy-900/50 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute w-64 h-64 border border-dashed border-gray-100 dark:border-navy-800/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />

                {/* 2. The Silk Thread Path */}
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-90">
                    {/* The "To-be-stitched" guide */}
                    <circle
                        cx="100" cy="100" r="80"
                        className="fill-none stroke-gray-50 dark:stroke-navy-900/40 stroke-1 stroke-dasharray-[4,4]"
                        strokeDasharray="4 4"
                    />

                    {/* The Actual Silk Thread */}
                    <motion.circle
                        cx="100"
                        cy="100"
                        r="80"
                        className="fill-none stroke-red-600 dark:stroke-red-500 stroke-[3]"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: [0, 1, 1, 0],
                            opacity: [0, 1, 1, 0],
                            strokeWidth: [3, 4, 3]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.45, 0.55, 1]
                        }}
                    />
                </svg>

                {/* 3. The Tailor's Pin (Needle + Logo Head) */}
                <motion.div
                    className="absolute w-12 h-32 z-30 flex flex-col items-center"
                    style={{
                        transformOrigin: '50% 100%',
                        top: 'calc(50% - 130px)', // Positioned relative to the track radius
                    }}
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {/* Pin Head (Branding) */}
                    <motion.div
                        className="w-12 h-12 bg-navy-900 rounded-full border-2 border-white shadow-xl flex items-center justify-center p-2.5 overflow-hidden"
                        animate={{
                            boxShadow: ["0 4px 6px rgba(0,0,0,0.1)", "0 10px 20px rgba(0,0,0,0.3)", "0 4px 6px rgba(0,0,0,0.1)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <img
                            src="/whitelogo.png"
                            alt="Broncstudio"
                            className="w-full h-full object-contain"
                        />
                    </motion.div>

                    {/* Needle Body */}
                    <div className="w-[3px] h-20 bg-gradient-to-b from-navy-900 via-gray-400 to-gray-200 rounded-full relative">
                        {/* Eye of the needle */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-4 border border-white/20 rounded-full" />

                        {/* Needle Tip Shine */}
                        <motion.div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/40 blur-md rounded-full"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    </div>
                </motion.div>

                {/* 4. Center Brand Identity */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
                    <motion.div
                        className="relative h-12 w-48 opacity-20 dark:opacity-40"
                        animate={{ opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity }}
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

            {/* 5. Text Display & Quotes */}
            <div className="mt-12 text-center space-y-6 max-w-sm px-4">
                <div className="space-y-3">
                    <motion.div
                        className="h-[2px] w-24 bg-gradient-to-r from-transparent via-navy-900 dark:via-white to-transparent mx-auto"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-black tracking-[0.5em] text-navy-900 dark:text-white uppercase"
                    >
                        {text}
                    </motion.p>
                </div>

                {/* Random Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="relative"
                >
                    <p className="text-sm font-medium italic text-gray-500 dark:text-gray-400 leading-relaxed">
                        "{quote}"
                    </p>
                </motion.div>

                <div className="flex justify-center gap-1.5">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            className="w-1 h-1 bg-red-600 rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </div>
            </div>

            {/* Floating Fabric/Texture Elements (Optional artistic touch) */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-navy-900 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-600 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
