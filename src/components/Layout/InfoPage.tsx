'use client';

import React from 'react';
import AmbientBackground from '@/components/UI/AmbientBackground';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface InfoPageProps {
    title: string;
    category?: string;
    children: React.ReactNode;
}

export default function InfoPage({ title, category = 'Help', children }: InfoPageProps) {
    return (
        <div className="relative min-h-screen pt-[calc(72px+2rem)] pb-20">
            <AmbientBackground />

            <div className="relative z-10 max-w-[800px] mx-auto px-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-secondary mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <span className="text-secondary opacity-70">{category}</span>
                    <ChevronRight size={14} />
                    <span className="text-primary font-medium">{title}</span>
                </div>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4 leading-tight">
                        {title}
                    </h1>
                    <div className="w-20 h-1 bg-coral-500 rounded-full" />
                </div>

                {/* Content */}
                <div className="prose prose-lg prose-navy dark:prose-invert max-w-none">
                    {children}
                </div>
            </div>
        </div>
    );
}
