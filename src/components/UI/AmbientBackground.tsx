'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AmbientBackgroundProps {
    className?: string;
}

export default function AmbientBackground({ className = "" }: AmbientBackgroundProps) {
    return (
        <div className={`fixed inset-0 min-h-screen w-full -z-10 bg-background overflow-hidden transition-colors duration-700 ${className}`}>
            {/* Animated Orbs - Hidden in Dark Mode for Pure Black */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-200/30 dark:hidden blur-[100px]"
            />

            <motion.div
                animate={{
                    x: [0, -70, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.5, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2
                }}
                className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-200/30 dark:hidden blur-[100px]"
            />

            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
                className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-pink-200/20 dark:hidden blur-[120px]"
            />
        </div>
    );
}
