'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, ChevronRight, ExternalLink } from 'lucide-react';

export default function LegalPage() {
    const policies = [
        { label: 'Privacy Policy', desc: 'How we handle your data', href: '/policies/privacy' },
        { label: 'Terms & Conditions', desc: 'Rules for using our platform', href: '/policies/terms' },
        { label: 'Returns & Refunds', desc: 'Our policy on returns and exchanges', href: '/help/returns' },
        { label: 'Shipping Policy', desc: 'Delivery timelines and charges', href: '/help/shipping' }
    ];

    return (
        <main className="bg-[#FAF9F7] min-h-screen py-8 pb-24 md:pb-12">
            <div className="container-premium max-w-[800px] mx-auto px-4 md:px-0">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-navy-900 border border-gray-100 hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-navy-900">Legal & Policies</h1>
                        <p className="text-gray-500 text-sm">Review our platform policies and terms.</p>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm">
                    {policies.map((policy, i) => (
                        <Link
                            key={i}
                            href={policy.href}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors group border-b border-gray-50 last:border-none"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-navy-900 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                                <FileText size={18} />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-navy-900">{policy.label}</div>
                                <div className="text-sm text-gray-500">{policy.desc}</div>
                            </div>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-8 text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} Broncstudio. All rights reserved.
                </div>
            </div>
        </main>
    );
}
