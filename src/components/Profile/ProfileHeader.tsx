'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit2, ShieldCheck, Moon, Sun } from 'lucide-react';

export default function ProfileHeader() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Initialize Theme
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark') ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

            if (isDark) {
                setTheme('dark');
                document.documentElement.classList.add('dark');
            } else {
                setTheme('light');
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setTheme('dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setTheme('light');
        }
    };

    return (
        <div className="flex items-center gap-4 p-6 bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden transition-colors duration-300">
            {/* Decorative Background Blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-coral-50 dark:bg-coral-500/10 rounded-full blur-3xl -z-0 opacity-50" />

            <div className="relative z-10 w-20 h-20 rounded-full bg-navy-900 dark:bg-white text-white dark:text-navy-900 flex items-center justify-center text-2xl font-bold ring-4 ring-gray-50 dark:ring-white/10 flex-shrink-0 transition-colors duration-300">
                DJ
            </div>

            <div className="relative z-10 flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-navy-900 dark:text-white transition-colors duration-300">Dhanush J</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">+91 98765 43210 • dhanush@example.com</p>

                <div className="flex items-center gap-2 mt-2">
                    <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors duration-300">
                        <ShieldCheck size={12} /> Verified Member
                    </span>
                    <span className="text-xs text-gray-400">Since Jan 2026</span>
                </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
                <button
                    onClick={toggleTheme}
                    className="group relative p-2.5 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-white/5 transition-all duration-300 hover:scale-105 active:scale-95"
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    <div className="relative transition-transform duration-500 rotate-0 dark:rotate-180">
                        {theme === 'light' ? (
                            <Moon size={20} className="text-indigo-600 dark:text-indigo-400 fill-indigo-100 dark:fill-indigo-900/30 transition-colors" />
                        ) : (
                            <Sun size={20} className="text-amber-500 fill-amber-500/20 transition-colors" />
                        )}
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </button>
                <Link href="/profile/edit" className="p-2.5 text-gray-400 hover:text-navy-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm">
                    <Edit2 size={20} />
                </Link>
            </div>
        </div>
    );
}
