'use client';

import React from 'react';
import Link from 'next/link';
import AmbientBackground from '@/components/UI/AmbientBackground';
import { RefreshCw, Home } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <AmbientBackground />

            <div className="container-premium max-w-md mx-auto text-center relative z-10">
                <div className="mb-8">
                    <div className="text-9xl font-heading font-bold text-primary/10 select-none">
                        Oops
                    </div>
                </div>

                <h1 className="text-3xl font-heading font-bold text-primary mb-4">
                    Something went wrong!
                </h1>
                <p className="text-secondary mb-8 leading-relaxed">
                    We encountered an unexpected error. <br />
                    Don't worry, our team has been notified.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={reset}
                        className="bg-black dark:bg-white text-white dark:text-black font-bold py-3 px-6 rounded-full hover:bg-coral-500 dark:hover:bg-coral-400 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} /> Try Again
                    </button>
                    <Link
                        href="/"
                        className="bg-card text-primary font-bold py-3 px-6 rounded-full border border-subtle hover:border-primary transition-all flex items-center justify-center gap-2"
                    >
                        <Home size={18} /> Return Home
                    </Link>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
    );
}
