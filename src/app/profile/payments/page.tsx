'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react';

export default function PaymentsPage() {
    return (
        <main className="bg-[#FAF9F7] dark:bg-black min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[800px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="p-2 rounded-full bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors shadow-sm">
                            <ArrowLeft size={20} className="text-navy-900 dark:text-white" />
                        </Link>
                        <h1 className="text-2xl font-bold text-navy-900 dark:text-white font-heading">Payment Methods</h1>
                    </div>
                    <button className="bg-navy-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-coral-500 dark:hover:bg-gray-200 transition-colors shadow-lg shadow-navy-900/10">
                        <Plus size={16} /> Add Method
                    </button>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-[#1A1F71] rounded flex items-center justify-center text-white font-bold italic text-xs">
                                VISA
                            </div>
                            <div>
                                <p className="font-bold text-navy-900 dark:text-white">•••• •••• •••• 4242</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Expires 12/28</p>
                            </div>
                        </div>
                        <button className="text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors p-2">
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-between opacity-60">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-[#EB001B] rounded flex items-center justify-center text-white font-bold italic text-xs overflow-hidden">
                                <span className="scale-75">Master</span>
                            </div>
                            <div>
                                <p className="font-bold text-navy-900 dark:text-white">•••• •••• •••• 5555</p>
                                <p className="text-xs text-red-500 font-bold">Expired</p>
                            </div>
                        </div>
                        <button className="text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors p-2">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
