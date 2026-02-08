'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Key, Smartphone, ChevronRight } from 'lucide-react';

export default function SecurityPage() {
    return (
        <main className="bg-[#FAF9F7] dark:bg-black min-h-screen py-8 pb-24 md:pb-12">
            <div className="container-premium max-w-[800px] mx-auto px-4 md:px-0">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-navy-900 dark:text-white border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Login & Security</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your password and account security.</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Password */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                                <Key size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Password</h2>
                        </div>

                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-6 mb-6">
                            <div>
                                <div className="font-bold text-navy-900 dark:text-white">Change Password</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Last changed 3 months ago</div>
                            </div>
                            <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/20 text-sm font-bold text-navy-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                                Update
                            </button>
                        </div>

                        <div className="flex items-center justify-center">
                            <p className="text-xs text-gray-400">Secure password requirements apply.</p>
                        </div>
                    </div>

                    {/* 2FA */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Smartphone size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Two-Factor Authentication</h2>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-bold text-navy-900 dark:text-white">Text Message (SMS)</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Receive a code on your mobile phone to log in.</div>
                                <div className="text-xs text-green-600 dark:text-green-400 font-bold mt-1 max-w-fit bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">Enabled</div>
                            </div>
                            <button className="text-navy-900 dark:text-white hover:text-coral-500 transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Devices */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/10 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                                <Shield size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Recent Login Activity</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                    <div>
                                        <div className="font-bold text-sm text-navy-900 dark:text-white">MacBook Pro (This Device)</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Mumbai, India • Active Now</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                                    <div>
                                        <div className="font-bold text-sm text-navy-900 dark:text-white">iPhone 14 Pro</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Mumbai, India • 2 hours ago</div>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-red-500 hover:text-red-600">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
