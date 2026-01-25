'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Mail, Phone, ExternalLink } from 'lucide-react';

export default function SupportPage() {
    return (
        <main className="bg-[#FAF9F7] min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[800px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm">
                        <ArrowLeft size={20} className="text-navy-900" />
                    </Link>
                    <h1 className="text-2xl font-bold text-navy-900 font-heading">Help & Support</h1>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="mailto:support@broncstudio.com" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4 group">
                        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Mail size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-navy-900">Email Support</h3>
                            <p className="text-sm text-gray-500">Get a response within 24 hours</p>
                        </div>
                    </a>

                    <a href="tel:+919876543210" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4 group">
                        <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Phone size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-navy-900">Call Us</h3>
                            <p className="text-sm text-gray-500">Mon-Fri, 9am - 6pm</p>
                        </div>
                    </a>
                </div>

                <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-bold text-navy-900 mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        {['How do I track my order?', 'What is the return policy?', 'Do you ship internationally?'].map((q, i) => (
                            <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                                <span className="text-sm font-medium text-gray-700">{q}</span>
                                <ExternalLink size={16} className="text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
