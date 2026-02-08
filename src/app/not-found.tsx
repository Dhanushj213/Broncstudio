'use client';

import React from 'react';
import Link from 'next/link';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <AmbientBackground />

            <div className="container-premium max-w-md mx-auto text-center relative z-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="text-9xl font-heading font-bold text-primary/10 select-none">
                        404
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl font-heading font-bold text-primary mb-4">
                        Wandered off the path?
                    </h1>
                    <p className="text-secondary mb-8 leading-relaxed">
                        It seems we can't find the page you're looking for. <br />
                        Even little legends get lost sometimes!
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/"
                            className="bg-black dark:bg-white text-white dark:text-black font-bold py-3 px-6 rounded-full hover:bg-coral-500 dark:hover:bg-coral-400 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <Home size={18} /> Return Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-card text-primary font-bold py-3 px-6 rounded-full border border-subtle hover:border-primary transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} /> Go Back
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
    );
}
