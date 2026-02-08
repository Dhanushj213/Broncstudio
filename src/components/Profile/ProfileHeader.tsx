'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit2, ShieldCheck, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ProfileHeaderProps {
    user: {
        email?: string;
        full_name?: string;
        avatar_url?: string;
        created_at?: string;
    } | null;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Get initials from name or email
    const getInitials = () => {
        if (user?.full_name) {
            return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        if (user?.email) {
            return user.email.slice(0, 2).toUpperCase();
        }
        return 'U';
    };

    // Get display name
    const getDisplayName = () => {
        if (user?.full_name) return user.full_name;
        if (user?.email) return user.email.split('@')[0];
        return 'User';
    };

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="flex items-center gap-4 p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden transition-colors duration-300">
            {/* Decorative Background Blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-coral-50 dark:bg-accent-orange-soft/10 rounded-full blur-3xl -z-0 opacity-50" />

            {/* Avatar */}
            {user?.avatar_url ? (
                <img
                    src={user.avatar_url}
                    alt={getDisplayName()}
                    className="relative z-10 w-20 h-20 rounded-full ring-4 ring-[#FAF9F7] dark:ring-black flex-shrink-0 object-cover"
                />
            ) : (
                <div className="relative z-10 w-20 h-20 rounded-full bg-gray-100 dark:bg-white/10 text-navy-900 dark:text-white flex items-center justify-center text-2xl font-bold ring-4 ring-[#FAF9F7] dark:ring-black flex-shrink-0 transition-colors duration-300">
                    {getInitials()}
                </div>
            )}

            <div className="relative z-10 flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-navy-900 dark:text-white transition-colors duration-300">
                    {getDisplayName()}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">
                    {user?.email || 'No email'}
                </p>

                <div className="flex items-center gap-2 mt-2">
                    <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors duration-300">
                        <ShieldCheck size={12} /> Member
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
                {mounted && (
                    <button
                        onClick={toggleTheme}
                        className="group relative p-2.5 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                        title={resolvedTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        <div className="relative transition-transform duration-500 rotate-0 dark:rotate-180">
                            {resolvedTheme === 'light' ? (
                                <Moon size={20} className="text-indigo-600 dark:text-indigo-400 fill-indigo-100 dark:fill-indigo-900/30 transition-colors" />
                            ) : (
                                <Sun size={20} className="text-amber-500 fill-amber-500/20 transition-colors" />
                            )}
                        </div>
                    </button>
                )}
                <Link href="/profile/edit" className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm">
                    <Edit2 size={20} />
                </Link>
            </div>
        </div>
    );
}
