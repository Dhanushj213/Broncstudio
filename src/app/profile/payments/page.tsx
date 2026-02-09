'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react';

export default function PaymentsPage() {
    return (
        <main className="bg-[#FAF9F7] dark:bg-black min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[800px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="p-2 rounded-full bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors shadow-sm">
                            <ArrowLeft size={20} className="text-navy-900 dark:text-white" />
                        </Link>
                        <h1 className="text-2xl font-bold text-navy-900 dark:text-white font-heading">Payment Methods</h1>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm text-center">
                    <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-6">
                        <CreditCard size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-3">Secure Payments</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                        For your security, we do not store your credit card or payment details on our servers. All transactions are processed securely through our trusted payment partners.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 opacity-70">
                        <div className="px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5">UPI</div>
                        <div className="px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5">VISA</div>
                        <div className="px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5">Mastercard</div>
                        <div className="px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5">Net Banking</div>
                        <div className="px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5">Wallets</div>
                    </div>
                </div>
            </div>
        </main>
    );
}
